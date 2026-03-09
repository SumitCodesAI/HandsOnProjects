---
name: DatabricksSchemaDocumenter
description: Retrieves all table schemas from Databricks and generates comprehensive documentation
version: 1.0.0
---

# Databricks Schema Documentation Skill

## Purpose
This skill connects to Databricks Unity Catalog API to retrieve all tables within a specified schema, fetch their detailed schemas (columns, data types, constraints), and generate comprehensive documentation.

## Prerequisites

### Required Secrets (Set in GitHub Repository Settings)
- `DATABRICKS_HOST` - Your Databricks workspace URL (e.g., `https://your-workspace.cloud.databricks.com`)
- `DATABRICKS_TOKEN` - Personal access token with read permissions on Unity Catalog

### How to Get Databricks Token
1. Go to Databricks workspace → Settings (top right) → User Settings
2. Click "Developer" → "Access tokens" 
3. Click "Generate new token"
4. Copy the token and save it as `DATABRICKS_TOKEN` in GitHub Secrets

## API Endpoints Used

### 1. List All Tables in a Schema
```
GET /api/2.1/unity-catalog/tables
Parameters:
  - catalog_name: workspace
  - schema_name: healthcare_claims
```

### 2. Get Detailed Table Schema
```
GET /api/2.1/unity-catalog/tables/{catalog}.{schema}.{table}
Example: /api/2.1/unity-catalog/tables/workspace.healthcare_claims.claims_data
```

### 3. Get Column Statistics (Optional)
```
GET /api/2.1/unity-catalog/tables/{full_table_name}/column-stats
```

## Implementation

### Python Function to List Tables

```python
import requests
import os
from typing import List, Dict
import json

def list_tables_in_schema(catalog: str, schema: str) -> List[str]:
    """
    List all tables in a Databricks schema
    
    Args:
        catalog: Catalog name (e.g., 'workspace')
        schema: Schema name (e.g., 'healthcare_claims')
    
    Returns:
        List of table names
    """
    host = os.environ.get('DATABRICKS_HOST')
    token = os.environ.get('DATABRICKS_TOKEN')
    
    url = f"{host}/api/2.1/unity-catalog/tables"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "catalog_name": catalog,
        "schema_name": schema
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    
    tables = response.json().get('tables', [])
    return [table['name'] for table in tables]
```

### Python Function to Get Table Schema

```python
def get_table_schema(catalog: str, schema: str, table: str) -> Dict:
    """
    Get detailed schema information for a table
    
    Args:
        catalog: Catalog name
        schema: Schema name  
        table: Table name
    
    Returns:
        Dictionary with table metadata and column information
    """
    host = os.environ.get('DATABRICKS_HOST')
    token = os.environ.get('DATABRICKS_TOKEN')
    
    full_table_name = f"{catalog}.{schema}.{table}"
    url = f"{host}/api/2.1/unity-catalog/tables/{full_table_name}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()
```

### Complete Documentation Generator

```python
def generate_schema_documentation(catalog: str, schema: str) -> str:
    """
    Generate comprehensive documentation for all tables in a schema
    
    Args:
        catalog: Catalog name
        schema: Schema name
    
    Returns:
        Markdown formatted documentation string
    """
    doc = f"# Schema Documentation: {catalog}.{schema}\n\n"
    doc += f"**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    # Get list of all tables
    tables = list_tables_in_schema(catalog, schema)
    doc += f"**Total Tables:** {len(tables)}\n\n"
    doc += "---\n\n"
    
    # Iterate through each table
    for table_name in tables:
        table_info = get_table_schema(catalog, schema, table_name)
        
        doc += f"## Table: `{table_name}`\n\n"
        
        # Basic info
        doc += f"- **Full Name:** `{catalog}.{schema}.{table_name}`\n"
        doc += f"- **Type:** {table_info.get('table_type', 'N/A')}\n"
        doc += f"- **Owner:** {table_info.get('owner', 'N/A')}\n"
        
        if table_info.get('comment'):
            doc += f"- **Description:** {table_info['comment']}\n"
        
        if table_info.get('storage_location'):
            doc += f"- **Storage:** `{table_info['storage_location']}`\n"
        
        doc += "\n### Columns\n\n"
        doc += "| Column Name | Data Type | Nullable | Comment |\n"
        doc += "|-------------|-----------|----------|----------|\n"
        
        columns = table_info.get('columns', [])
        for col in columns:
            col_name = col.get('name', '')
            col_type = col.get('type_text', col.get('type_name', ''))
            nullable = "✓" if col.get('nullable', True) else "✗"
            comment = col.get('comment', '')
            
            doc += f"| `{col_name}` | {col_type} | {nullable} | {comment} |\n"
        
        # Partition information
        partition_cols = [col for col in columns if col.get('partition_index') is not None]
        if partition_cols:
            doc += "\n### Partitioning\n"
            doc += "Partitioned by: " + ", ".join([f"`{col['name']}`" for col in partition_cols]) + "\n"
        
        doc += "\n---\n\n"
    
    return doc
```

## Instructions for Agents Using This Skill

When an agent needs to document a Databricks schema:

1. **Extract parameters** from user request:
   - Catalog name (default: `workspace`)
   - Schema name (e.g., `healthcare_claims`)

2. **Call the documentation generator**:
   ```python
   doc_content = generate_schema_documentation("workspace", "healthcare_claims")
   ```

3. **Save the documentation**:
   - Create file: `docs/databricks/{schema}_SCHEMA.md`
   - Commit to repository
   - Or create a PR with the documentation

4. **Provide summary** to user:
   - Number of tables documented
   - Link to the generated file
   - Any warnings or issues encountered

## Error Handling

- **401 Unauthorized**: Check if `DATABRICKS_TOKEN` is valid
- **403 Forbidden**: Token doesn't have permission to read Unity Catalog
- **404 Not Found**: Catalog or schema doesn't exist
- **Network errors**: Verify `DATABRICKS_HOST` is correct

## Output Format

The skill generates a Markdown file with this structure:

```markdown
# Schema Documentation: workspace.healthcare_claims

**Generated on:** 2026-03-08 14:30:00
**Total Tables:** 3

---

## Table: `claims_data`

- **Full Name:** `workspace.healthcare_claims.claims_data`
- **Type:** MANAGED
- **Owner:** user@company.com

### Columns

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|----------|
| `claim_id` | bigint | ✗ | Unique claim identifier |
| `patient_id` | bigint | ✗ | Patient identifier |
| `claim_date` | date | ✓ | Date claim was filed |
...
```

## Example Usage by Agent

```markdown
User: "@DataEngineer document the healthcare_claims schema"

Agent workflow:
1. Recognize request for schema documentation
2. Use DatabricksSchemaDocumenter skill
3. Call generate_schema_documentation("workspace", "healthcare_claims")
4. Save output to docs/databricks/healthcare_claims_SCHEMA.md
5. Respond: "I've documented 3 tables from healthcare_claims schema. [View documentation](docs/databricks/healthcare_claims_SCHEMA.md)"
```
