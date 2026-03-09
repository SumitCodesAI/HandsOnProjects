"""
Databricks Schema Documentation Generator
==========================================

This script connects to Databricks Unity Catalog API and generates
comprehensive documentation for all tables in a specified schema.

Usage:
    python databricks_documenter.py --catalog workspace --schema healthcare_claims

Environment Variables Required:
    DATABRICKS_HOST: Your Databricks workspace URL
    DATABRICKS_TOKEN: Personal access token
"""

import requests
import os
import sys
from typing import List, Dict
from datetime import datetime
import argparse


class DatabricksDocumenter:
    """Connects to Databricks and generates schema documentation."""
    
    def __init__(self, host: str, token: str):
        """
        Initialize the documenter with credentials.
        
        Args:
            host: Databricks workspace URL (e.g., https://your-workspace.cloud.databricks.com)
            token: Personal access token with Unity Catalog read permissions
        """
        self.host = host.rstrip('/')
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    def list_tables_in_schema(self, catalog: str, schema: str) -> List[str]:
        """
        List all table names in a schema.
        
        Args:
            catalog: Catalog name (e.g., 'workspace')
            schema: Schema name (e.g., 'healthcare_claims')
        
        Returns:
            List of table names
        
        Raises:
            requests.HTTPError: If API request fails
        """
        url = f"{self.host}/api/2.1/unity-catalog/tables"
        params = {
            "catalog_name": catalog,
            "schema_name": schema
        }
        
        print(f"📡 Fetching tables from {catalog}.{schema}...")
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        tables = response.json().get('tables', [])
        table_names = [table['name'] for table in tables]
        
        print(f"✅ Found {len(table_names)} tables")
        return table_names
    
    def get_table_schema(self, catalog: str, schema: str, table: str) -> Dict:
        """
        Get detailed schema information for a table.
        
        Args:
            catalog: Catalog name
            schema: Schema name
            table: Table name
        
        Returns:
            Dictionary containing table metadata and column information
        
        Raises:
            requests.HTTPError: If API request fails
        """
        full_table_name = f"{catalog}.{schema}.{table}"
        url = f"{self.host}/api/2.1/unity-catalog/tables/{full_table_name}"
        
        print(f"  📋 Getting schema for {table}...")
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        
        return response.json()
    
    def generate_schema_documentation(self, catalog: str, schema: str) -> str:
        """
        Generate comprehensive Markdown documentation for all tables in a schema.
        
        Args:
            catalog: Catalog name
            schema: Schema name
        
        Returns:
            Markdown formatted documentation string
        """
        doc = f"# Schema Documentation: {catalog}.{schema}\n\n"
        doc += f"**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Get list of all tables
        try:
            tables = self.list_tables_in_schema(catalog, schema)
        except requests.HTTPError as e:
            return f"❌ Error fetching tables: {e}\n"
        
        doc += f"**Total Tables:** {len(tables)}\n\n"
        
        if not tables:
            doc += "*No tables found in this schema.*\n"
            return doc
        
        doc += "## Table of Contents\n\n"
        for table_name in tables:
            doc += f"- [{table_name}](#{table_name.replace('_', '-')})\n"
        doc += "\n---\n\n"
        
        total_columns = 0
        
        # Document each table
        for table_name in tables:
            try:
                table_info = self.get_table_schema(catalog, schema, table_name)
                
                doc += f"## Table: `{table_name}`\n\n"
                
                # Basic metadata
                doc += f"- **Full Name:** `{catalog}.{schema}.{table_name}`\n"
                doc += f"- **Type:** {table_info.get('table_type', 'N/A')}\n"
                doc += f"- **Owner:** {table_info.get('owner', 'N/A')}\n"
                
                if table_info.get('comment'):
                    doc += f"- **Description:** {table_info['comment']}\n"
                
                if table_info.get('storage_location'):
                    doc += f"- **Storage Location:** `{table_info['storage_location']}`\n"
                
                if table_info.get('created_at'):
                    created = datetime.fromtimestamp(table_info['created_at'] / 1000)
                    doc += f"- **Created:** {created.strftime('%Y-%m-%d %H:%M:%S')}\n"
                
                # Column information
                doc += "\n### Columns\n\n"
                doc += "| Column Name | Data Type | Nullable | Comment |\n"
                doc += "|-------------|-----------|----------|----------|\n"
                
                columns = table_info.get('columns', [])
                total_columns += len(columns)
                
                for col in columns:
                    col_name = col.get('name', '')
                    col_type = col.get('type_text', col.get('type_name', ''))
                    nullable = "✓" if col.get('nullable', True) else "✗"
                    comment = col.get('comment', '')
                    
                    doc += f"| `{col_name}` | {col_type} | {nullable} | {comment} |\n"
                
                doc += f"\n**Column Count:** {len(columns)}\n"
                
                # Partition information
                partition_cols = [col for col in columns if col.get('partition_index') is not None]
                if partition_cols:
                    doc += "\n### Partitioning Strategy\n\n"
                    doc += "This table is partitioned by: "
                    doc += ", ".join([f"`{col['name']}`" for col in partition_cols]) + "\n"
                
                # Properties
                if table_info.get('properties'):
                    props = table_info['properties']
                    if props:
                        doc += "\n### Table Properties\n\n"
                        for key, value in props.items():
                            doc += f"- **{key}:** `{value}`\n"
                
                doc += "\n---\n\n"
                
            except requests.HTTPError as e:
                doc += f"❌ Error fetching schema for {table_name}: {e}\n\n"
                doc += "---\n\n"
        
        # Summary
        doc += "## Summary\n\n"
        doc += f"- **Total Tables:** {len(tables)}\n"
        doc += f"- **Total Columns:** {total_columns}\n"
        doc += f"- **Catalog:** `{catalog}`\n"
        doc += f"- **Schema:** `{schema}`\n"
        
        return doc
    
    def save_documentation(self, catalog: str, schema: str, output_dir: str = "docs/databricks") -> str:
        """
        Generate and save documentation to a file.
        
        Args:
            catalog: Catalog name
            schema: Schema name
            output_dir: Directory to save the documentation file
        
        Returns:
            Path to the saved file
        """
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate documentation
        doc_content = self.generate_schema_documentation(catalog, schema)
        
        # Save to file
        filename = f"{schema}_SCHEMA.md"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(doc_content)
        
        print(f"\n✅ Documentation saved to: {filepath}")
        return filepath


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description='Generate Databricks schema documentation',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python databricks_documenter.py --catalog workspace --schema healthcare_claims
  python databricks_documenter.py -c workspace -s default -o docs/db

Environment Variables:
  DATABRICKS_HOST    Your Databricks workspace URL
  DATABRICKS_TOKEN   Personal access token for authentication
        """
    )
    
    parser.add_argument(
        '--catalog', '-c',
        required=True,
        help='Catalog name (e.g., workspace)'
    )
    
    parser.add_argument(
        '--schema', '-s',
        required=True,
        help='Schema name (e.g., healthcare_claims)'
    )
    
    parser.add_argument(
        '--output-dir', '-o',
        default='docs/databricks',
        help='Output directory for documentation (default: docs/databricks)'
    )
    
    args = parser.parse_args()
    
    # Get credentials from environment
    host = os.environ.get('DATABRICKS_HOST')
    token = os.environ.get('DATABRICKS_TOKEN')
    
    if not host:
        print("❌ Error: DATABRICKS_HOST environment variable not set")
        print("   Set it with: export DATABRICKS_HOST='https://your-workspace.cloud.databricks.com'")
        sys.exit(1)
    
    if not token:
        print("❌ Error: DATABRICKS_TOKEN environment variable not set")
        print("   Generate token at: Databricks → User Settings → Developer → Access Tokens")
        print("   Set it with: export DATABRICKS_TOKEN='your-token-here'")
        sys.exit(1)
    
    print("🚀 Databricks Schema Documentation Generator\n")
    print(f"Catalog: {args.catalog}")
    print(f"Schema: {args.schema}")
    print(f"Output: {args.output_dir}\n")
    
    # Generate documentation
    try:
        documenter = DatabricksDocumenter(host, token)
        filepath = documenter.save_documentation(args.catalog, args.schema, args.output_dir)
        print(f"\n✨ Documentation generation complete!")
        
    except requests.HTTPError as e:
        print(f"\n❌ HTTP Error: {e}")
        if e.response.status_code == 401:
            print("   → Token is invalid or expired. Generate a new one.")
        elif e.response.status_code == 403:
            print("   → Token doesn't have permission to read Unity Catalog.")
        elif e.response.status_code == 404:
            print("   → Catalog or schema not found. Check the names.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
