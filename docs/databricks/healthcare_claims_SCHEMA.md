# Databricks Schema Documentation

**Catalog:** `workspace`  
**Schema:** `healthcare_claims`  
**Generated:** 2026-03-09 06:51:27  

---

## Summary

**Total Tables:** 3

### Tables

- **claims_data** (MANAGED)
- **claims_line_data** (MANAGED)
- **class_plans** (MANAGED)

---

## Pending DDL Changes

The following ALTER TABLE statements are planned based on issue request ([Databricks_DDL.xlsx](https://github.com/user-attachments/files/25849346/Databricks_DDL.xlsx)):

```sql
ALTER TABLE workspace.healthcare_claims.Claims_Data ADD COLUMN CD_FLAG char DEFAULT 'N';
ALTER TABLE workspace.healthcare_claims.Class_Plans ADD COLUMN CP_FLAG char DEFAULT 'N';
ALTER TABLE workspace.healthcare_claims.Claims_Line_Data ADD COLUMN CL_FLAG char DEFAULT 'N';
```

---

## Table: `claims_data`

**Type:** MANAGED  
**Columns:** 14  
**Created:** 2026-03-09  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|----------|
| `claim_number` | `string` | ✗ |  |
| `plan_id` | `string` | ✗ |  |
| `member_id` | `string` | ✗ |  |
| `member_name` | `string` | ✗ |  |
| `date_of_service` | `date` | ✗ |  |
| `claim_received_date` | `date` | ✗ |  |
| `claim_status` | `string` | ✗ |  |
| `provider_name` | `string` | ✗ |  |
| `provider_npi` | `string` | ✗ |  |
| `diagnosis_code` | `string` | ✗ |  |
| `total_billed_amt` | `decimal(12,2)` | ✗ |  |
| `allowed_amt` | `decimal(12,2)` | ✗ |  |
| `paid_amt` | `decimal(12,2)` | ✗ |  |
| `cd_flag` | `char` | ✓ | Default: 'N' |

**Storage:** `s3://dbstorage-prod-at7cy/uc/bd3c56e1-fd90-4aaf-bd45-86aca0e0f3b5/f6813e27-9d16-441c-8295-a443f51fbed4/__unitystorage/catalogs/9fed6708-8804-4901-a987-d9f40db160fc/tables/3652b8f1-f533-4c7c-ae35-a1cd2696d601`

---

## Table: `claims_line_data`

**Type:** MANAGED  
**Columns:** 14  
**Created:** 2026-03-09  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|----------|
| `line_id` | `string` | ✗ |  |
| `claim_number` | `string` | ✗ |  |
| `line_number` | `int` | ✗ |  |
| `service_date` | `date` | ✗ |  |
| `procedure_code` | `string` | ✗ |  |
| `procedure_desc` | `string` | ✗ |  |
| `revenue_code` | `string` | ✓ |  |
| `quantity` | `int` | ✗ |  |
| `unit_of_measure` | `string` | ✗ |  |
| `billed_amt` | `decimal(12,2)` | ✗ |  |
| `allowed_amt` | `decimal(12,2)` | ✗ |  |
| `paid_amt` | `decimal(12,2)` | ✗ |  |
| `adjustment_reason` | `string` | ✓ |  |
| `cl_flag` | `char` | ✓ | Default: 'N' |

**Storage:** `s3://dbstorage-prod-at7cy/uc/bd3c56e1-fd90-4aaf-bd45-86aca0e0f3b5/f6813e27-9d16-441c-8295-a443f51fbed4/__unitystorage/catalogs/9fed6708-8804-4901-a987-d9f40db160fc/tables/262d240f-0776-42d4-9ff0-6668ec8135af`

---

## Table: `class_plans`

**Type:** MANAGED  
**Columns:** 12  
**Created:** 2026-03-09  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|----------|
| `plan_id` | `string` | ✗ |  |
| `plan_name` | `string` | ✗ |  |
| `plan_type` | `string` | ✗ |  |
| `coverage_type` | `string` | ✗ |  |
| `deductible_amt` | `decimal(10,2)` | ✗ |  |
| `copay_amt` | `decimal(10,2)` | ✗ |  |
| `max_out_pocket` | `decimal(10,2)` | ✗ |  |
| `premium_amt` | `decimal(10,2)` | ✗ |  |
| `effective_date` | `date` | ✗ |  |
| `termination_date` | `date` | ✓ |  |
| `is_active` | `boolean` | ✗ |  |
| `cp_flag` | `char` | ✓ | Default: 'N' |

**Storage:** `s3://dbstorage-prod-at7cy/uc/bd3c56e1-fd90-4aaf-bd45-86aca0e0f3b5/f6813e27-9d16-441c-8295-a443f51fbed4/__unitystorage/catalogs/9fed6708-8804-4901-a987-d9f40db160fc/tables/828926a4-6c94-457e-936c-79973cae944c`

---

## Summary

- **Total Tables:** 3
- **Total Columns:** 40
- **Generated:** 2026-03-09 06:51:27
