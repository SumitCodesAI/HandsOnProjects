"""
Databricks DDL Executor
Executes ALTER TABLE ADD COLUMN statements from Excel specifications
"""

import requests
import pandas as pd
import re
import os
import sys
from typing import List, Dict, Optional

# Configuration from environment
DATABRICKS_HOST = os.environ.get('DATABRICKS_HOST', '').rstrip('/')
DATABRICKS_TOKEN = os.environ.get('DATABRICKS_TOKEN', '')

if not DATABRICKS_HOST.startswith('http'):
    DATABRICKS_HOST = f'https://{DATABRICKS_HOST}'

headers = {
    "Authorization": f"Bearer {DATABRICKS_TOKEN}",
    "Content-Type": "application/json"
}

APPROVAL_TOKEN = os.environ.get("DDL_APPROVAL_TOKEN", "APPROVE_DATABRICKS_DDL")


def get_warehouse_id() -> str:
    """Get SQL Warehouse ID from Databricks"""
    url = f"{DATABRICKS_HOST}/api/2.0/sql/warehouses"
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    warehouses = response.json().get('warehouses', [])
    
    # Prefer RUNNING warehouses
    running = [w for w in warehouses if w.get('state') == 'RUNNING']
    if running:
        return running[0]['id']
    elif warehouses:
        return warehouses[0]['id']
    else:
        raise Exception("No SQL warehouses available")


def execute_ddl(warehouse_id: str, sql_statement: str) -> Dict:
    """Execute DDL statement on Databricks"""
    url = f"{DATABRICKS_HOST}/api/2.0/sql/statements"
    body = {
        "warehouse_id": warehouse_id,
        "statement": sql_statement,
        "wait_timeout": "50s"
    }
    
    print(f"Executing: {sql_statement}")
    response = requests.post(url, headers=headers, json=body, timeout=60)
    response.raise_for_status()
    result = response.json()
    
    status = result.get('status', {}).get('state', 'UNKNOWN')
    if status == 'SUCCEEDED':
        return {'success': True}
    else:
        error_msg = result.get('status', {}).get('error', {}).get('message', 'Unknown error')
        return {'success': False, 'error': error_msg}


def validate_table(table: str) -> bool:
    """Validate table name format (catalog.schema.table or schema.table)"""
    parts = table.split('.')
    return len(parts) in [2, 3] and all(re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', p) for p in parts)


def validate_column(column: str) -> bool:
    """Validate column name (alphanumeric + underscore only)"""
    return bool(re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', column))


def sanitize_default(value, datatype: str) -> Optional[str]:
    """Sanitize default value to prevent SQL injection"""
    if pd.isna(value) or str(value).strip() == '':
        return None
    
    value_str = str(value).strip()
    
    # String types - wrap in quotes and escape
    if any(dt in datatype.upper() for dt in ['STRING', 'VARCHAR', 'CHAR']):
        value_str = value_str.strip("'\"").replace("'", "''")
        return f"'{value_str}'"
    
    # Numeric types - validate
    if any(dt in datatype.upper() for dt in ['INT', 'BIGINT', 'DECIMAL', 'DOUBLE', 'FLOAT']):
        try:
            float(value_str)
            return value_str
        except ValueError:
            raise ValueError(f"Invalid numeric value: {value_str}")
    
    # Boolean
    if 'BOOLEAN' in datatype.upper():
        if value_str.upper() in ['TRUE', 'FALSE']:
            return value_str.upper()
        elif value_str in ['1', '0']:
            return 'TRUE' if value_str == '1' else 'FALSE'
        raise ValueError(f"Invalid boolean value: {value_str}")
    
    return value_str


def build_alter_statement(table: str, column: str, datatype: str, default_value) -> tuple:
    """Build ALTER TABLE ADD COLUMN and optional UPDATE statements"""
    if not validate_table(table):
        raise ValueError(f"Invalid table name: {table}")
    if not validate_column(column):
        raise ValueError(f"Invalid column name: {column}")
    
    # ALTER TABLE without DEFAULT constraint (not supported in Delta)
    alter_stmt = f"ALTER TABLE {table} ADD COLUMN {column} {datatype}"
    
    # If default value provided, generate UPDATE statement
    update_stmt = None
    if default_value is not None:
        sanitized = sanitize_default(default_value, datatype)
        if sanitized:
            update_stmt = f"UPDATE {table} SET {column} = {sanitized} WHERE {column} IS NULL"
    
    return alter_stmt, update_stmt


def build_plan_from_excel(excel_path: str) -> List[Dict]:
    """
    Build ALTER TABLE plan from Excel without executing.

    Excel Format:
    - Column B (index 1): Table name
    - Column C (index 2): Column name
    - Column D (index 3): Datatype
    - Column E (index 4): Default value (optional)
    """
    df = pd.read_excel(excel_path, sheet_name=0)

    plan = []
    for _, row in df.iterrows():
        if len(row) < 4:
            continue

        table = row.iloc[1]
        column = row.iloc[2]
        datatype = row.iloc[3]
        default_value = row.iloc[4] if len(row) > 4 else None

        if pd.isna(table) or pd.isna(column) or pd.isna(datatype):
            continue

        table = str(table).strip()
        column = str(column).strip()
        datatype = str(datatype).strip()

        try:
            alter_sql, update_sql = build_alter_statement(table, column, datatype, default_value)
            plan.append(
                {
                    "table": table,
                    "column": column,
                    "datatype": datatype,
                    "alter_sql": alter_sql,
                    "update_sql": update_sql,
                    "valid": True,
                }
            )
        except Exception as e:
            plan.append(
                {
                    "table": table,
                    "column": column,
                    "datatype": datatype,
                    "error": str(e),
                    "valid": False,
                }
            )

    return plan


def write_plan_outputs(plan: List[Dict], sql_file: str = "alter_statements.sql", preview_file: str = "ddl_preview.md") -> None:
    """Write generated SQL and markdown preview for approval."""
    valid_items = [item for item in plan if item.get("valid")]
    invalid_items = [item for item in plan if not item.get("valid")]

    with open(sql_file, "w", encoding="utf-8") as f:
        for item in valid_items:
            f.write(item["alter_sql"] + ";\n")
            if item.get("update_sql"):
                f.write(item["update_sql"] + ";\n")

    preview = "## 📝 DDL Plan Generated (No Execution Yet)\n\n"
    preview += "Execution is blocked until explicit approval is provided.\n\n"
    preview += f"- Total rows parsed: {len(plan)}\n"
    preview += f"- Valid statements: {len(valid_items)}\n"
    preview += f"- Invalid rows: {len(invalid_items)}\n\n"
    preview += f"To approve execution, provide token: `{APPROVAL_TOKEN}`\n\n"

    if valid_items:
        preview += "### ✅ Statements Ready\n"
        preview += "| Table | Column | Datatype |\n"
        preview += "|-------|--------|----------|\n"
        for item in valid_items:
            preview += f"| {item['table']} | {item['column']} | {item['datatype']} |\n"
        preview += "\n"

    if invalid_items:
        preview += "### ❌ Invalid Rows\n"
        preview += "| Table | Column | Error |\n"
        preview += "|-------|--------|-------|\n"
        for item in invalid_items:
            preview += f"| {item.get('table', '')} | {item.get('column', '')} | {item.get('error', 'Unknown')} |\n"

    with open(preview_file, "w", encoding="utf-8") as f:
        f.write(preview)


def execute_plan(plan: List[Dict], warehouse_id: str) -> List[Dict]:
    """Execute only valid plan items against Databricks."""
    results = []
    for item in plan:
        if not item.get("valid"):
            results.append(
                {
                    "table": item.get("table", ""),
                    "column": item.get("column", ""),
                    "datatype": item.get("datatype", ""),
                    "status": "FAILED",
                    "error": item.get("error", "Invalid row"),
                }
            )
            continue

        try:
            # Execute ALTER TABLE
            alter_result = execute_ddl(warehouse_id, item["alter_sql"])
            if not alter_result["success"]:
                results.append(
                    {
                        "table": item["table"],
                        "column": item["column"],
                        "datatype": item["datatype"],
                        "status": "FAILED",
                        "error": f"ALTER failed: {alter_result['error']}",
                    }
                )
                continue
            
            # Execute UPDATE if default value provided
            if item.get("update_sql"):
                update_result = execute_ddl(warehouse_id, item["update_sql"])
                if not update_result["success"]:
                    results.append(
                        {
                            "table": item["table"],
                            "column": item["column"],
                            "datatype": item["datatype"],
                            "status": "PARTIAL",
                            "error": f"Column added but UPDATE failed: {update_result['error']}",
                        }
                    )
                    continue
            
            # Both succeeded
            results.append(
                {
                    "table": item["table"],
                    "column": item["column"],
                    "datatype": item["datatype"],
                    "status": "SUCCESS",
                }
            )
        except Exception as e:
            results.append(
                {
                    "table": item["table"],
                    "column": item["column"],
                    "datatype": item["datatype"],
                    "status": "FAILED",
                    "error": str(e),
                }
            )

    return results


def process_excel(excel_path: str, warehouse_id: str) -> List[Dict]:
    """
    Read Excel and execute DDL for each row
    
    Excel Format:
    - Column B (index 1): Table name
    - Column C (index 2): Column name
    - Column D (index 3): Datatype
    - Column E (index 4): Default value (optional)
    """
    df = pd.read_excel(excel_path, sheet_name=0)
    
    results = []
    for idx, row in df.iterrows():
        # Excel columns: B=1, C=2, D=3, E=4 (0-indexed)
        if len(row) < 4:
            continue
        
        table = row.iloc[1]
        column = row.iloc[2]
        datatype = row.iloc[3]
        default_value = row.iloc[4] if len(row) > 4 else None
        
        # Skip empty rows
        if pd.isna(table) or pd.isna(column) or pd.isna(datatype):
            continue
        
        table = str(table).strip()
        column = str(column).strip()
        datatype = str(datatype).strip()
        
        try:
            sql = build_alter_statement(table, column, datatype, default_value)
            result = execute_ddl(warehouse_id, sql)
            
            if result['success']:
                results.append({
                    'table': table,
                    'column': column,
                    'datatype': datatype,
                    'status': 'SUCCESS'
                })
            else:
                results.append({
                    'table': table,
                    'column': column,
                    'datatype': datatype,
                    'status': 'FAILED',
                    'error': result['error']
                })
        except Exception as e:
            results.append({
                'table': table,
                'column': column,
                'datatype': datatype,
                'status': 'FAILED',
                'error': str(e)
            })
    
    return results


def format_results(results: List[Dict]) -> str:
    """Format results for GitHub issue comment"""
    success_count = sum(1 for r in results if r['status'] == 'SUCCESS')
    partial_count = sum(1 for r in results if r['status'] == 'PARTIAL')
    failed_count = len(results) - success_count - partial_count

    all_success = len(results) > 0 and failed_count == 0 and partial_count == 0
    if all_success:
        output = f"## ✅ Databricks DDL Execution Successful\n\n"
        output += "All requested table alterations were applied successfully.\n\n"
    else:
        output = f"## ⚠️ Databricks DDL Execution Completed with Issues\n\n"
        if len(results) == 0:
            output += "No executable rows were found in the provided Excel file.\n\n"

    output += f"**Summary:**\n"
    output += f"- Overall status: {'SUCCESS' if all_success else 'PARTIAL_OR_FAILED'}\n"
    output += f"- Total operations: {len(results)}\n"
    output += f"- ✅ Successful: {success_count}\n"
    output += f"- ⚠️ Partial: {partial_count}\n"
    output += f"- ❌ Failed: {failed_count}\n\n"
    
    if partial_count > 0:
        output += "### ⚠️ Partial Operations\n"
        output += "| Table | Column | Issue |\n"
        output += "|-------|--------|-------|\n"
        for r in results:
            if r['status'] == 'PARTIAL':
                output += f"| {r['table']} | {r['column']} | {r.get('error', 'Unknown')} |\n"
        output += "\n"
    
    if failed_count > 0:
        output += "### ❌ Failed Operations\n"
        output += "| Table | Column | Error |\n"
        output += "|-------|--------|-------|\n"
        for r in results:
            if r['status'] == 'FAILED':
                output += f"| {r['table']} | {r['column']} | {r.get('error', 'Unknown')} |\n"
        output += "\n"
    
    if success_count > 0:
        output += "### ✅ Successful Operations\n"
        output += "| Table | Column | Datatype |\n"
        output += "|-------|--------|----------|\n"
        for r in results:
            if r['status'] == 'SUCCESS':
                output += f"| {r['table']} | {r['column']} | {r['datatype']} |\n"
    
    return output


def main():
    """Main execution flow"""
    if len(sys.argv) < 2:
        print("Usage: python databricks_ddl_executor.py <excel_file> [--execute --approve-token <token>]")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    execute_mode = "--execute" in sys.argv

    provided_token = None
    if "--approve-token" in sys.argv:
        token_index = sys.argv.index("--approve-token")
        if token_index + 1 < len(sys.argv):
            provided_token = sys.argv[token_index + 1]
    
    if not os.path.exists(excel_file):
        print(f"Error: Excel file not found: {excel_file}")
        sys.exit(1)
    
    print("=" * 60)
    print("Databricks DDL Executor")
    print("=" * 60)
    print(f"Host: {DATABRICKS_HOST}")
    print(f"Excel: {excel_file}")
    print(f"Mode: {'EXECUTE' if execute_mode else 'PLAN'}")
    print()
    
    try:
        print("Generating DDL plan from Excel...")
        plan = build_plan_from_excel(excel_file)
        write_plan_outputs(plan)
        print("✓ Plan files generated: alter_statements.sql, ddl_preview.md\n")

        if not execute_mode:
            print("Execution skipped (plan mode). Review ddl_preview.md and approve before execute mode.")
            return

        if provided_token != APPROVAL_TOKEN:
            print("❌ Approval token missing or invalid. Execution blocked.")
            print(f"Run with: --execute --approve-token {APPROVAL_TOKEN}")
            sys.exit(1)

        # Validate credentials only for execute mode
        if not DATABRICKS_HOST or not DATABRICKS_TOKEN:
            print("Error: DATABRICKS_HOST and DATABRICKS_TOKEN environment variables required for execute mode")
            sys.exit(1)

        print("Approval validated. Executing statements on Databricks...\n")

        print("Getting SQL warehouse...")
        warehouse_id = get_warehouse_id()
        print(f"✓ Using warehouse: {warehouse_id}\n")

        results = execute_plan(plan, warehouse_id)
        formatted_output = format_results(results)
        print(formatted_output)

        output_file = "ddl_results.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(formatted_output)
        print(f"\n✓ Results saved to: {output_file}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
