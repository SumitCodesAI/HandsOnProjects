"""
Builds Databricks SQL execution plan from Excel input for MCP-based execution.

Excel mapping (first sheet):
- Column B: table name (catalog.schema.table or schema.table)
- Column C: column name
- Column D: datatype
- Column E: default value (optional)
"""

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd


def validate_table_name(table_name: str) -> bool:
    parts = table_name.split(".")
    if len(parts) not in (2, 3):
        return False
    return all(re.match(r"^[a-zA-Z_][a-zA-Z0-9_]*$", part) for part in parts)


def validate_column_name(column_name: str) -> bool:
    return bool(re.match(r"^[a-zA-Z_][a-zA-Z0-9_]*$", column_name))


def sanitize_default(default_value: Any, datatype: str) -> Optional[str]:
    if pd.isna(default_value) or str(default_value).strip() == "":
        return None

    value = str(default_value).strip()
    upper_datatype = datatype.upper()

    if any(token in upper_datatype for token in ["STRING", "VARCHAR", "CHAR"]):
        clean = value.strip("'\"").replace("'", "''")
        return f"'{clean}'"

    if any(token in upper_datatype for token in ["INT", "BIGINT", "DECIMAL", "DOUBLE", "FLOAT"]):
        float(value)
        return value

    if "BOOLEAN" in upper_datatype:
        if value.upper() in ("TRUE", "FALSE"):
            return value.upper()
        if value in ("1", "0"):
            return "TRUE" if value == "1" else "FALSE"
        raise ValueError(f"Invalid boolean default value: {value}")

    return value


def build_sql_pair(table: str, column: str, datatype: str, default_value: Any) -> Tuple[str, Optional[str]]:
    if not validate_table_name(table):
        raise ValueError(f"Invalid table name: {table}")
    if not validate_column_name(column):
        raise ValueError(f"Invalid column name: {column}")

    alter_sql = f"ALTER TABLE {table} ADD COLUMN {column} {datatype}"

    update_sql = None
    sanitized_default = sanitize_default(default_value, datatype)
    if sanitized_default is not None:
        update_sql = f"UPDATE {table} SET {column} = {sanitized_default} WHERE {column} IS NULL"

    return alter_sql, update_sql


def build_plan(excel_path: Path) -> List[Dict[str, Any]]:
    df = pd.read_excel(excel_path, sheet_name=0)

    plan: List[Dict[str, Any]] = []
    for index, row in df.iterrows():
        if len(row) < 4:
            continue

        table = row.iloc[1] if len(row) > 1 else None
        column = row.iloc[2] if len(row) > 2 else None
        datatype = row.iloc[3] if len(row) > 3 else None
        default_value = row.iloc[4] if len(row) > 4 else None

        if pd.isna(table) or pd.isna(column) or pd.isna(datatype):
            continue

        table_text = str(table).strip()
        column_text = str(column).strip()
        datatype_text = str(datatype).strip()

        try:
            alter_sql, update_sql = build_sql_pair(table_text, column_text, datatype_text, default_value)
            plan.append(
                {
                    "row_number": int(index) + 2,
                    "table": table_text,
                    "column": column_text,
                    "datatype": datatype_text,
                    "alter_sql": alter_sql,
                    "update_sql": update_sql,
                    "valid": True,
                }
            )
        except Exception as error:
            plan.append(
                {
                    "row_number": int(index) + 2,
                    "table": table_text,
                    "column": column_text,
                    "datatype": datatype_text,
                    "valid": False,
                    "error": str(error),
                }
            )

    return plan


def write_outputs(plan: List[Dict[str, Any]], sql_path: Path, preview_path: Path, json_path: Path) -> None:
    valid_items = [item for item in plan if item.get("valid")]
    invalid_items = [item for item in plan if not item.get("valid")]

    with sql_path.open("w", encoding="utf-8") as sql_file:
        for item in valid_items:
            sql_file.write(item["alter_sql"] + ";\n")
            if item.get("update_sql"):
                sql_file.write(item["update_sql"] + ";\n")

    with json_path.open("w", encoding="utf-8") as json_file:
        json.dump(plan, json_file, indent=2)

    lines: List[str] = []
    lines.append("## MCP DDL Plan (Preview Only)")
    lines.append("")
    lines.append("Execution should only happen after explicit owner approval comment: `approve`.")
    lines.append("")
    lines.append(f"- Total parsed rows: {len(plan)}")
    lines.append(f"- Valid rows: {len(valid_items)}")
    lines.append(f"- Invalid rows: {len(invalid_items)}")
    lines.append("")

    if valid_items:
        lines.append("### SQL To Execute")
        lines.append("```sql")
        for item in valid_items:
            lines.append(item["alter_sql"] + ";")
            if item.get("update_sql"):
                lines.append(item["update_sql"] + ";")
        lines.append("```")
        lines.append("")

    if invalid_items:
        lines.append("### Invalid Rows")
        lines.append("| Excel Row | Table | Column | Error |")
        lines.append("|---|---|---|---|")
        for item in invalid_items:
            lines.append(
                f"| {item.get('row_number', '')} | {item.get('table', '')} | {item.get('column', '')} | {item.get('error', 'Unknown')} |"
            )
        lines.append("")

    preview_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate MCP DDL plan from Excel")
    parser.add_argument("--excel", required=True, help="Path to .xlsx file")
    parser.add_argument("--out-sql", default="mcp_alter_statements.sql", help="Output SQL file path")
    parser.add_argument("--out-md", default="mcp_plan_preview.md", help="Output Markdown preview path")
    parser.add_argument("--out-json", default="mcp_plan.json", help="Output JSON plan path")
    args = parser.parse_args()

    excel_path = Path(args.excel)
    if not excel_path.exists():
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    plan = build_plan(excel_path)
    write_outputs(plan, Path(args.out_sql), Path(args.out_md), Path(args.out_json))

    valid_count = sum(1 for row in plan if row.get("valid"))
    invalid_count = len(plan) - valid_count
    print("MCP DDL plan generated successfully")
    print(f"Valid rows: {valid_count}")
    print(f"Invalid rows: {invalid_count}")
    print(f"SQL file: {args.out_sql}")
    print(f"Preview file: {args.out_md}")
    print(f"Plan file: {args.out_json}")


if __name__ == "__main__":
    main()
