"""
Databricks Schema Documentation Generator
==========================================

Generates Excel and Markdown documentation for Databricks schemas.

Usage:
    python databricks_documenter.py --catalog workspace --schema healthcare_claims --format both

Environment Variables Required:
    DATABRICKS_HOST: Your Databricks workspace URL
    DATABRICKS_TOKEN: Personal access token
"""

import requests
import os
import argparse
from typing import Dict, List
import pandas as pd
from datetime import datetime, timezone
from urllib.parse import quote


class DatabricksDocumenter:
    def __init__(self, host: str, token: str):
        self.host = self._normalize_host(host)
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    @staticmethod
    def _normalize_host(host: str) -> str:
        normalized = host.strip().rstrip('/')
        if not normalized.startswith("http://") and not normalized.startswith("https://"):
            normalized = f"https://{normalized}"
        return normalized

    @staticmethod
    def _format_timestamp(ts) -> str:
        """Convert a Databricks timestamp (int ms or ISO string) to a YYYY-MM-DD string."""
        if ts is None:
            return "N/A"
        if isinstance(ts, int):
            return datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
        # Already a string (ISO format)
        return str(ts)[:10]
    
    def list_tables(self, catalog: str, schema: str) -> List[Dict]:
        """List all tables in a schema, handling API pagination automatically."""
        url = f"{self.host}/api/2.1/unity-catalog/tables"
        
        print(f"📡 Fetching tables from {catalog}.{schema}...")
        print(f"   URL: {url}?catalog_name={catalog}&schema_name={schema}")

        tables: List[Dict] = []
        params: Dict = {"catalog_name": catalog, "schema_name": schema, "max_results": 200}

        while True:
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            page_tables = data.get('tables', [])
            tables.extend(page_tables)

            next_page_token = data.get('next_page_token')
            if not next_page_token:
                break
            params = {"page_token": next_page_token}

        print(f"✅ Found {len(tables)} tables")
        
        if not tables:
            print(f"\n⚠️  WARNING: No tables found in {catalog}.{schema}")
            print(f"   Check that:")
            print(f"   1. Catalog name is correct: {catalog}")
            print(f"   2. Schema name is correct: {schema}")
            print(f"   3. You have permission to read this schema in Databricks")
        
        return tables
    
    def get_table_schema(self, catalog: str, schema: str, table: str) -> Dict:
        """Get detailed schema for a table"""
        full_table_name = quote(f"{catalog}.{schema}.{table}", safe='.')
        url = f"{self.host}/api/2.1/unity-catalog/tables/{full_table_name}"
        
        print(f"  📋 Getting schema for {table}...")
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def generate_excel_documentation(self, catalog: str, schema: str, output_dir: str = "docs/databricks"):
        """Generate Excel file with schema info. Returns output path or raises SystemExit on failure."""
        os.makedirs(output_dir, exist_ok=True)
        
        tables = self.list_tables(catalog, schema)
        if not tables:
            print(f"\n❌ ERROR: No tables found in {catalog}.{schema} - cannot generate documentation.")
            print(f"Please verify the catalog/schema names exist and your token has SELECT privilege on them.")
            raise SystemExit(1)
        
        excel_filename = f"{output_dir}/{schema}_schema_and_data.xlsx"
        
        print(f"\n📊 Generating Excel documentation")
        writer = pd.ExcelWriter(excel_filename, engine='openpyxl')
        
        summary_data = []
        
        for table_info in tables:
            table_name = table_info["name"]
            print(f"Processing: {table_name}...")
            
            try:
                schema_details = self.get_table_schema(catalog, schema, table_name)
                columns = schema_details.get("columns", [])
                
                created_at = schema_details.get("created_at")
                created_str = self._format_timestamp(created_at)
                
                summary_data.append({
                    "Table Name": table_name,
                    "Column Count": len(columns),
                    "Table Type": schema_details.get("table_type", "N/A"),
                    "Created": created_str
                })
                
                schema_df = pd.DataFrame([
                    {
                        "Column Name": col["name"],
                        "Data Type": col["type_text"],
                        "Nullable": "Yes" if col.get("nullable") else "No",
                        "Position": col.get("position", ""),
                        "Comment": col.get("comment", "")
                    }
                    for col in columns
                ])
                
                sheet_name = table_name[:31]
                schema_df.to_excel(writer, sheet_name=sheet_name, index=False)
                
                print(f"  ✓ {len(columns)} columns documented")
                
            except Exception as e:
                print(f"  ✗ Error: {str(e)}")
                continue
        
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name="Summary", index=False)
        
        # Auto-adjust column widths
        for sheet_name in writer.sheets:
            worksheet = writer.sheets[sheet_name]
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        writer.close()
        
        print(f"\n✅ Excel: {excel_filename}")
        print(f"📋 Tables: {len(summary_data)}")
        print(f"📊 Columns: {sum(item['Column Count'] for item in summary_data)}")
        return excel_filename
    
    def generate_markdown_documentation(self, catalog: str, schema: str, output_dir: str = "docs/databricks"):
        """Generate Markdown documentation. Raises SystemExit on failure."""
        os.makedirs(output_dir, exist_ok=True)
        
        tables = self.list_tables(catalog, schema)
        if not tables:
            print(f"\n❌ ERROR: No tables found in {catalog}.{schema} - cannot generate documentation.")
            print(f"Please verify the catalog/schema names exist and your token has SELECT privilege on them.")
            raise SystemExit(1)
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        output_file = f"{output_dir}/{schema}_SCHEMA.md"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"# Databricks Schema Documentation\n\n")
            f.write(f"**Catalog:** `{catalog}`  \n")
            f.write(f"**Schema:** `{schema}`  \n")
            f.write(f"**Generated:** {timestamp}  \n\n")
            f.write(f"---\n\n")
            f.write(f"## Summary\n\n")
            f.write(f"**Total Tables:** {len(tables)}\n\n")
            
            f.write(f"### Tables\n\n")
            for table_info in tables:
                table_name = table_info["name"]
                table_type = table_info.get("table_type", "N/A")
                f.write(f"- **{table_name}** ({table_type})\n")
            
            f.write(f"\n---\n\n")
            
            total_columns = 0
            for table_info in tables:
                table_name = table_info["name"]
                print(f"Documenting: {table_name}")
                
                try:
                    schema_details = self.get_table_schema(catalog, schema, table_name)
                    columns = schema_details.get("columns", [])
                    total_columns += len(columns)
                    
                    f.write(f"## Table: `{table_name}`\n\n")
                    f.write(f"**Type:** {schema_details.get('table_type', 'N/A')}  \n")
                    f.write(f"**Columns:** {len(columns)}  \n")
                    
                    created_at = schema_details.get("created_at")
                    if created_at:
                        f.write(f"**Created:** {self._format_timestamp(created_at)}  \n")
                    
                    f.write(f"\n")
                    
                    if columns:
                        f.write(f"### Schema\n\n")
                        f.write(f"| Column Name | Data Type | Nullable | Comment |\n")
                        f.write(f"|-------------|-----------|----------|----------|\n")
                        
                        for col in columns:
                            name = col["name"]
                            dtype = col["type_text"]
                            nullable = "✓" if col.get("nullable") else "✗"
                            comment = col.get("comment", "").replace("|", "\\|")
                            f.write(f"| `{name}` | `{dtype}` | {nullable} | {comment} |\n")
                        
                        f.write(f"\n")
                    
                    storage_location = schema_details.get("storage_location")
                    if storage_location:
                        f.write(f"**Storage:** `{storage_location}`\n\n")
                    
                    properties = schema_details.get("properties", {})
                    # Filter out noisy internal Spark statistics and Delta internal keys
                    user_properties = {
                        k: v for k, v in properties.items()
                        if not k.startswith("spark.sql.statistics")
                        and not k.startswith("delta.")
                    }
                    if user_properties:
                        f.write(f"**Properties:**\n")
                        for key, value in user_properties.items():
                            f.write(f"- `{key}`: {value}\n")
                        f.write(f"\n")
                    
                    f.write(f"---\n\n")
                    
                except Exception as e:
                    f.write(f"⚠️ Error: {str(e)}\n\n")
                    print(f"  Error: {str(e)}")
            
            f.write(f"## Summary\n\n")
            f.write(f"- **Total Tables:** {len(tables)}\n")
            f.write(f"- **Total Columns:** {total_columns}\n")
            f.write(f"- **Generated:** {timestamp}\n")
        
        print(f"\n✅ Markdown: {output_file}")


def main():
    parser = argparse.ArgumentParser(description='Generate Databricks schema documentation')
    
    parser.add_argument('--catalog', '-c', default='workspace', help='Catalog name (default: workspace)')
    parser.add_argument('--schema', '-s', required=True, help='Schema name (e.g., healthcare_claims, default)')
    parser.add_argument('--format', '-f', choices=['excel', 'markdown', 'both'], 
                        default='both', help='Output format')
    parser.add_argument('--output-dir', '-o', default='docs/databricks', 
                        help='Output directory')
    
    args = parser.parse_args()
    
    # Strict validation - schema is required
    if not args.schema or args.schema.strip() == '':
        print("❌ FATAL: Schema name is empty or missing!")
        print("   Ensure your issue contains: schema: your_schema_name")
        return 1
    
    host = os.environ.get('DATABRICKS_HOST')
    token = os.environ.get('DATABRICKS_TOKEN')
    
    if not host or not token:
        print("❌ Error: DATABRICKS_HOST and DATABRICKS_TOKEN must be set (GitHub Actions Secrets or Variables)")
        return 1
    
    print(f"🚀 Databricks Schema Documentation Generator\n")
    print(f"📌 Catalog: {args.catalog}")
    print(f"📌 Schema: {args.schema}")
    print(f"📌 Format: {args.format}")
    print(f"📌 Host: {host}")
    print(f"📌 Output Dir: {args.output_dir}\n")
    print(f"🔗 Will fetch from: {host}/api/2.1/unity-catalog/tables?catalog_name={args.catalog}&schema_name={args.schema}\n")
    
    try:
        documenter = DatabricksDocumenter(host, token)
        
        if args.format in ['excel', 'both']:
            documenter.generate_excel_documentation(args.catalog, args.schema, args.output_dir)
        
        if args.format in ['markdown', 'both']:
            documenter.generate_markdown_documentation(args.catalog, args.schema, args.output_dir)
        
        print(f"\n✨ Complete!")
        return 0
        
    except requests.HTTPError as e:
        print(f"\n❌ HTTP Error: {e}")
        response_text = e.response.text if e.response is not None else ""
        if response_text:
            print(f"   → Response: {response_text[:500]}")
        if e.response.status_code == 401:
            print("   → Token invalid or expired")
        elif e.response.status_code == 403:
            print("   → No permission to read Unity Catalog")
        elif e.response.status_code == 404:
            print("   → Catalog or schema not found")
        return 1
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
