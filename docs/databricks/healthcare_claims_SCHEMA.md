# Schema Documentation: workspace.healthcare_claims

**Generated on:** 2026-03-09 03:14:53

**Total Tables:** 3

## Table of Contents

- [claims_data](#claims-data)
- [claims_line_data](#claims-line-data)
- [class_plans](#class-plans)

---

## Table: `claims_data`

- **Full Name:** `workspace.healthcare_claims.claims_data`
- **Type:** MANAGED
- **Owner:** data-engineering@company.com
- **Description:** Core claims table containing header-level claim records submitted by providers for patient services.
- **Storage Location:** `dbfs:/user/hive/warehouse/healthcare_claims.db/claims_data`

### Columns

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `claim_id` | bigint | ✗ | Unique claim identifier |
| `patient_id` | bigint | ✗ | Reference to patient |
| `provider_id` | bigint | ✓ | Reference to healthcare provider |
| `claim_date` | date | ✓ | Date claim was filed |
| `claim_amount` | decimal(10,2) | ✓ | Total billed claim amount |
| `claim_status` | string | ✓ | Current status of the claim (e.g., PENDING, APPROVED, DENIED) |
| `diagnosis_code` | string | ✓ | Primary diagnosis code (ICD-10) |
| `procedure_code` | string | ✓ | Primary procedure code (CPT) |
| `insurance_plan_id` | bigint | ✓ | Reference to insurance plan in class_plans |
| `approval_date` | date | ✓ | Date claim was approved by insurance |
| `paid_amount` | decimal(10,2) | ✓ | Amount paid by insurance |
| `deductible_amount` | decimal(10,2) | ✓ | Deductible applied to this claim |
| `copay_amount` | decimal(10,2) | ✓ | Copay amount collected from patient |
| `facility_id` | bigint | ✓ | Reference to facility where service was rendered |
| `created_at` | timestamp | ✗ | Record creation timestamp |

**Column Count:** 15

### Partitioning Strategy

This table is partitioned by: `claim_date`

---

## Table: `claims_line_data`

- **Full Name:** `workspace.healthcare_claims.claims_line_data`
- **Type:** MANAGED
- **Owner:** data-engineering@company.com
- **Description:** Line-item detail records for each claim, capturing individual services rendered within a single claim.
- **Storage Location:** `dbfs:/user/hive/warehouse/healthcare_claims.db/claims_line_data`

### Columns

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `line_id` | bigint | ✗ | Unique line item identifier |
| `claim_id` | bigint | ✗ | Reference to parent claim in claims_data |
| `line_number` | int | ✗ | Sequential line item number within the claim |
| `service_date` | date | ✓ | Date service was rendered |
| `service_code` | string | ✓ | Service procedure code (CPT) |
| `service_description` | string | ✓ | Human-readable description of the service |
| `quantity` | int | ✓ | Number of service units billed |
| `unit_price` | decimal(10,2) | ✓ | Billed price per unit |
| `line_amount` | decimal(10,2) | ✓ | Total billed amount for this line item |
| `diagnosis_code_1` | string | ✓ | Primary diagnosis code (ICD-10) |
| `diagnosis_code_2` | string | ✓ | Secondary diagnosis code (ICD-10) |
| `diagnosis_code_3` | string | ✓ | Tertiary diagnosis code (ICD-10) |
| `modifier` | string | ✓ | CPT procedure modifier code |
| `revenue_code` | string | ✓ | Revenue code used for facility billing |
| `ndc_code` | string | ✓ | National Drug Code for pharmacy line items |
| `rendering_provider_id` | bigint | ✓ | Provider who rendered this specific service |
| `place_of_service` | string | ✓ | Code indicating where service was provided |
| `allowed_amount` | decimal(10,2) | ✓ | Insurance contractual allowed amount |
| `paid_amount` | decimal(10,2) | ✓ | Amount paid by insurance for this line |
| `created_at` | timestamp | ✗ | Record creation timestamp |

**Column Count:** 20

> ⚠️ **Note:** This table has no partition columns. Consider partitioning by `service_date` to improve query performance on large datasets.

---

## Table: `class_plans`

- **Full Name:** `workspace.healthcare_claims.class_plans`
- **Type:** MANAGED
- **Owner:** data-engineering@company.com
- **Description:** Insurance plan reference table defining benefit structures, cost-sharing rules, and eligibility parameters.
- **Storage Location:** `dbfs:/user/hive/warehouse/healthcare_claims.db/class_plans`

### Columns

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `plan_id` | bigint | ✗ | Unique plan identifier |
| `plan_name` | string | ✗ | Name of the insurance plan |
| `plan_type` | string | ✓ | Type of plan (e.g., HMO, PPO, EPO, HDHP) |
| `carrier_id` | bigint | ✓ | Reference to the insurance carrier |
| `deductible_amount` | decimal(10,2) | ✓ | Annual individual deductible amount |
| `out_of_pocket_max` | decimal(10,2) | ✓ | Maximum annual out-of-pocket expense |
| `copay_primary_care` | decimal(10,2) | ✓ | Copay amount for primary care visits |
| `copay_specialist` | decimal(10,2) | ✓ | Copay amount for specialist visits |
| `effective_date` | date | ✓ | Date the plan becomes effective |
| `termination_date` | date | ✓ | Date the plan is terminated (null if active) |

**Column Count:** 10

---

## Summary

- **Total Tables:** 3
- **Total Columns:** 45
- **Catalog:** `workspace`
- **Schema:** `healthcare_claims`

## Recommendations

- ⚠️ **Partitioning:** `claims_line_data` (20 columns) has no partition columns. Consider partitioning by `service_date` for better query performance on large datasets.
- ⚠️ **Documentation:** Several columns in `claims_line_data` and `class_plans` could benefit from more detailed descriptions to improve analyst onboarding.
- ✅ **`claims_data`** is properly partitioned by `claim_date` for efficient date-range queries.
- ✅ Primary key columns (`claim_id`, `patient_id`, `line_id`, `plan_id`) are correctly defined as NOT NULL.
