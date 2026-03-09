---
name: DatabaseAdmin
description: Executes Databricks schema changes from Excel specifications
---

# DatabaseAdmin Agent

I execute Databricks DDL schema changes through GitHub Actions workflow when assigned to an issue with an Excel attachment.

## What I Do

When you assign me to an issue with an attached Excel file:
1. Workflow generates ALTER TABLE statements in preview mode
2. Workflow posts plan and waits for your approval comment: `approve`
3. Workflow executes changes in Databricks after approval
4. Workflow posts final execution report with summary and per-table status

## Excel Format Required

Your Excel file must have these columns:
- **Column B**: Table name (e.g., `workspace.healthcare_claims.claims_data`)
- **Column C**: New column name
- **Column D**: Datatype (e.g., `STRING`, `INT`, `DECIMAL(10,2)`)
- **Column E**: Default value (optional, leave empty for NULL)

## Example Issue

```
Please add columns to tables as specified in the attached Excel file.
```

Attach your Excel file, then assign the issue to me.

## Approval Step

- Execution does not start immediately.
- Workflow first generates a reviewable plan (`ddl_preview.md`, `alter_statements.sql`).
- Execution starts only after approval comment includes exactly: `approve`.

## Capabilities

- Execute ALTER TABLE ADD COLUMN statements
- Validate table/column names and datatypes
- Sanitize default values (SQL injection prevention)
- Continue processing even if some operations fail
- Provide final report with overall status and detailed success/failure sections

## Requirements

- DATABRICKS_HOST and DATABRICKS_TOKEN must be configured
- Token must have ALTER/MODIFY privilege on target tables
- At least one SQL warehouse must be available
