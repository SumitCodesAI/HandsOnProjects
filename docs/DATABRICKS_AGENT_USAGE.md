# How to Use the DataEngineer Agent for Databricks Documentation

This guide explains how to trigger and use the DataEngineer agent to automatically document your Databricks schemas.

## Table of Contents
1. [One-Time Setup](#one-time-setup)
2. [How Skills & Agents Work](#how-skills--agents-work)
3. [Triggering the Agent](#triggering-the-agent)
4. [Use Cases & Examples](#use-cases--examples)
5. [Local Script Alternative](#local-script-alternative)

---

## One-Time Setup

### Step 1: Get Databricks Credentials

1. **Get your Databricks workspace URL**:
   - Example: `https://adb-1234567890123456.7.azuredatabricks.net`
   - Or: `https://your-workspace.cloud.databricks.com`

2. **Generate a Personal Access Token**:
   - Log into Databricks
   - Click your profile (top right) → **User Settings**
   - Click **Developer** → **Access tokens**
   - Click **Generate new token**
   - Copy the token (you won't see it again!)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

   **Secret 1:**
   - Name: `DATABRICKS_HOST`
   - Value: `https://your-workspace.cloud.databricks.com`

   **Secret 2:**
   - Name: `DATABRICKS_TOKEN`
   - Value: `dapi123abc...` (your token)

### Step 3: Merge Agent & Skill to Main Branch

The agent and skill files need to be in your **main/default branch** to work:

```
.github/
  agents/
    DataEngineer.agent.md         ← Must be in main branch
  skills/
    databricks-schema-docs.skill.md  ← Must be in main branch
```

Create a PR and merge these files to main.

---

## How Skills & Agents Work

### The Relationship

```
┌──────────────┐
│     USER     │ → Mentions or assigns issue
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  @DataEngineer   │ → Agent (the conversational interface)
│     AGENT        │
└──────┬───────────┘
       │ Uses
       ▼
┌───────────────────────────┐
│ DatabricksSchemaDocumenter│ → Skill (the actual functionality)
│          SKILL            │
└────────┬──────────────────┘
         │ Calls
         ▼
┌────────────────────┐
│  Databricks API    │
│  (Unity Catalog)   │
└────────────────────┘
```

### Key Concepts

- **Skills** = Reusable functions (like API connectors)
  - Define HOW to do something
  - Can't be triggered directly
  - Located in `.github/skills/`

- **Agents** = Conversational assistants
  - Define WHO does what and WHEN
  - Users interact with agents
  - Use skills to accomplish tasks
  - Located in `.github/agents/`

**Analogy:** 
- Skill = A screwdriver (tool)
- Agent = A carpenter (uses the tool)
- You ask the carpenter to build something, they use the screwdriver

---

## Triggering the Agent

### Method 1: Mention in Issue (Recommended)

1. **Create or open a GitHub Issue**
2. **Mention the agent** with your request:

   ```
   @DataEngineer please document the healthcare_claims schema
   ```

3. The agent will:
   - Acknowledge your request
   - Connect to Databricks
   - Generate documentation
   - Create a PR with the docs
   - Comment back with results

### Method 2: Assign an Issue

1. **Create a GitHub Issue**:
   - Title: `Generate documentation for healthcare_claims schema`
   - Body: `We need comprehensive documentation of all tables in the healthcare_claims schema for onboarding new analysts.`

2. **Assign the issue** to `@DataEngineer`

3. The agent will automatically start processing

---

## Use Cases & Examples

### Example 1: Document All Tables in a Schema

**Issue Comment:**
```
@DataEngineer document the healthcare_claims schema
```

**What Happens:**
1. Agent retrieves all 3 tables:
   - `claims_data`
   - `claims_line_data`
   - `class_plans`

2. Gets full schema for each table (columns, types, constraints)

3. Generates `docs/databricks/healthcare_claims_SCHEMA.md`

4. Creates a PR with the documentation

5. Responds:
   ```
   ✅ Documentation generated successfully!
   
   **Schema:** workspace.healthcare_claims
   **Tables:** 3
   **Total Columns:** 45
   **File:** [healthcare_claims_SCHEMA.md](docs/databricks/healthcare_claims_SCHEMA.md)
   
   **Tables Documented:**
   - claims_data (15 columns)
   - claims_line_data (20 columns)  
   - class_plans (10 columns)
   ```

### Example 2: Quick Table Info

**Issue Comment:**
```
@DataEngineer what columns are in claims_data?
```

**Agent Response:**
```
### Table: `claims_data` (workspace.healthcare_claims)

| Column Name | Data Type | Nullable |
|-------------|-----------|----------|
| claim_id | bigint | ✗ |
| patient_id | bigint | ✗ |
| provider_id | bigint | ✓ |
| claim_date | date | ✓ |
| claim_amount | decimal(10,2) | ✓ |
...

**Total:** 15 columns
**Type:** MANAGED
**Partitioned by:** claim_date
```

### Example 3: Document Multiple Schemas

**Issue Comment:**
```
@DataEngineer document both healthcare_claims and default schemas
```

**What Happens:**
- Agent processes each schema separately
- Creates two documentation files
- Provides summary of both

### Example 4: Get Recommendations

**Issue Comment:**
```
@DataEngineer analyze healthcare_claims and suggest improvements
```

**Agent Response:**
```
### Analysis of workspace.healthcare_claims

**Tables:** 3
**Total Columns:** 45

### Recommendations:

⚠️ **Partitioning:**
- `claims_line_data` (20 cols) is not partitioned. Consider partitioning by date for better query performance.

⚠️ **Data Types:**
- 8 columns use STRING type. Consider using more specific types (date, int, decimal) where applicable.

⚠️ **Documentation:**
- 12 columns are missing descriptions. Add comments for better understanding.

✅ **Good Practices:**
- `claims_data` is properly partitioned by `claim_date`
- Primary keys are clearly defined as NOT NULL
```

---

## Local Script Alternative

If you want to generate documentation locally without using the GitHub agent:

### Setup

```bash
# Set environment variables
export DATABRICKS_HOST="https://your-workspace.cloud.databricks.com"
export DATABRICKS_TOKEN="dapi123abc..."

# Or on Windows PowerShell:
$env:DATABRICKS_HOST="https://your-workspace.cloud.databricks.com"
$env:DATABRICKS_TOKEN="dapi123abc..."
```

### Run the Script

```bash
# Document healthcare_claims schema
python scripts/databricks_documenter.py \
  --catalog workspace \
  --schema healthcare_claims

# Output will be saved to: docs/databricks/healthcare_claims_SCHEMA.md
```

### Script Options

```bash
python scripts/databricks_documenter.py --help

Options:
  --catalog, -c     Catalog name (e.g., workspace) [REQUIRED]
  --schema, -s      Schema name (e.g., healthcare_claims) [REQUIRED]
  --output-dir, -o  Output directory (default: docs/databricks)
```

### Example Output Structure

```
docs/
  databricks/
    healthcare_claims_SCHEMA.md   ← Generated documentation
    default_SCHEMA.md
    sales_SCHEMA.md
```

---

## Generated Documentation Format

The agent/script generates a comprehensive Markdown file with:

```markdown
# Schema Documentation: workspace.healthcare_claims

**Generated on:** 2026-03-08 14:30:00
**Total Tables:** 3

## Table of Contents
- [claims_data](#claims-data)
- [claims_line_data](#claims-line-data)
- [class_plans](#class-plans)

---

## Table: `claims_data`

- **Full Name:** workspace.healthcare_claims.claims_data
- **Type:** MANAGED
- **Owner:** user@company.com
- **Created:** 2025-11-15 10:23:45
- **Storage Location:** `dbfs:/user/hive/warehouse/healthcare_claims.db/claims_data`

### Columns

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `claim_id` | bigint | ✗ | Unique claim identifier |
| `patient_id` | bigint | ✗ | Reference to patient |
| `claim_date` | date | ✓ | Date claim was filed |
...

**Column Count:** 15

### Partitioning Strategy
This table is partitioned by: `claim_date`

---

[Repeat for each table...]

## Summary
- **Total Tables:** 3
- **Total Columns:** 45
- **Catalog:** workspace
- **Schema:** healthcare_claims
```

---

## Troubleshooting

### Agent Doesn't Respond

**Check:**
1. Are the agent files in the **main branch**?
2. Did you mention `@DataEngineer` correctly?
3. Are GitHub secrets configured?

### Authentication Errors

**Error:** `401 Unauthorized`

**Fix:**
- Token expired → Generate new token in Databricks
- Update `DATABRICKS_TOKEN` secret in GitHub

### Permission Errors

**Error:** `403 Forbidden`

**Fix:**
- Token needs read permissions on Unity Catalog
- Contact your Databricks admin to grant access

### Schema Not Found

**Error:** `404 Not Found`

**Fix:**
- Check catalog name (probably `workspace`)
- Check schema name spelling (e.g., `healthcare_claims`)
- Verify you have access to that schema

---

## Next Steps

1. ✅ Complete setup (secrets, merge to main)
2. ✅ Test with a simple mention: `@DataEngineer document healthcare_claims`
3. ✅ Review generated documentation
4. ✅ Share with your team
5. ✅ Set up scheduled documentation updates (optional)

## Questions?

- **Agent not triggering?** Ensure files are in main branch
- **API errors?** Check your token and permissions
- **Want to customize?** Edit the agent instructions in `.github/agents/DataEngineer.agent.md`

---

**Your Current Setup:**
- Catalog: `workspace`
- Schema: `healthcare_claims`
- Tables: `claims_data`, `claims_line_data`, `class_plans`

**Ready to go! Try:**
```
@DataEngineer document the healthcare_claims schema
```
