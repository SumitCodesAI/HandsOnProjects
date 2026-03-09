# Healthcare Claims Schema Documentation

> **Catalog:** `hive_metastore`  **Schema:** `healthcare_claims`
> 
> **Source:** sample/demo data (no Databricks credentials found)
> **Generated:** 2026-03-09 06:21:24 UTC
> **Data Status:** ⚠️ Sample/Demo Data

---

## Schema Overview

The **`healthcare_claims`** schema is a comprehensive healthcare claims data model that
supports end-to-end claim lifecycle management — from patient enrollment and
provider credentialing through claim submission, adjudication, payment, and audit.

| Metric | Value |
|--------|-------|
| Tables | 7 |
| Total Columns | 117 |
| Estimated Total Rows | 117,737,510 |

### Entity-Relationship Summary

```
patients ──────────────────────────────────┐
                                            │ patient_id
providers ─────────────────────────────────┤
                                            │ provider_id
                                            ▼
                                         claims
                                         /  |  \
                              claim_id  /   |   \ claim_id
                                       /    |    \
                               diagnoses  payments  procedures
                                                       |
                                              claim_id |
                                                       ▼
                                                 claim_audits
```

---

## Table of Contents

- [claims](#claims) — *8,420,315 rows*
- [patients](#patients) — *1,245,890 rows*
- [providers](#providers) — *98,432 rows*
- [diagnoses](#diagnoses) — *24,680,201 rows*
- [procedures](#procedures) — *31,102,890 rows*
- [payments](#payments) — *9,874,112 rows*
- [claim_audits](#claim-audits) — *42,315,670 rows*

---

## `claims`

Core fact table storing all submitted insurance claims. Each row represents one claim submitted by a provider on behalf of a patient.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.claims` |
| Estimated Rows | 8,420,315 |
| Columns | 21 |
| Nullable Columns | 6 |
| Primary Key(s) | `claim_id` |
| Partition Column(s) | `partition_date` |

**Foreign Keys:**

- `patient_id` → `patients.patient_id`
- `provider_id` → `providers.provider_id`

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `claim_id` | `STRING` | ✗ | 🔑 | Unique identifier for each claim (UUID) |
| 2 | `claim_number` | `STRING` | ✗ |  | Human-readable claim reference number (e.g. CLM-2024-000001) |
| 3 | `patient_id` | `STRING` | ✗ |  | FK → patients.patient_id |
| 4 | `provider_id` | `STRING` | ✗ |  | FK → providers.provider_id |
| 5 | `claim_type` | `STRING` | ✗ |  | Type of claim: MEDICAL, DENTAL, VISION, PHARMACY |
| 6 | `claim_status` | `STRING` | ✗ |  | Current status: SUBMITTED, PENDING, APPROVED, DENIED, PAID, APPEALED |
| 7 | `service_date_start` | `DATE` | ✗ |  | First date of service covered by this claim |
| 8 | `service_date_end` | `DATE` | ✓ |  | Last date of service (NULL for single-day claims) |
| 9 | `submission_date` | `TIMESTAMP` | ✗ |  | UTC timestamp when claim was submitted to the payer |
| 10 | `adjudication_date` | `TIMESTAMP` | ✓ |  | UTC timestamp when payer completed adjudication |
| 11 | `billed_amount` | `DECIMAL(12,2)` | ✗ |  | Total amount billed by provider |
| 12 | `allowed_amount` | `DECIMAL(12,2)` | ✓ |  | Payer-allowed amount after contract rates applied |
| 13 | `paid_amount` | `DECIMAL(12,2)` | ✓ |  | Actual amount paid by insurer |
| 14 | `patient_responsibility` | `DECIMAL(12,2)` | ✓ |  | Copay + coinsurance + deductible owed by patient |
| 15 | `denial_reason_code` | `STRING` | ✓ |  | CARC/RARC code when claim_status = DENIED |
| 16 | `place_of_service` | `STRING` | ✗ |  | CMS Place of Service code (e.g. 11=Office, 21=Inpatient) |
| 17 | `npi` | `STRING` | ✗ |  | National Provider Identifier of billing provider |
| 18 | `insurance_plan_id` | `STRING` | ✗ |  | Identifier of insurance plan used for this claim |
| 19 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |
| 20 | `updated_at` | `TIMESTAMP` | ✗ |  | Row last-update timestamp (UTC) |
| 21 | `partition_date` | `DATE` | ✗ |  | Partition column = service_date_start truncated to month |

---

## `patients`

Dimension table containing de-identified patient demographics and insurance enrollment information.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.patients` |
| Estimated Rows | 1,245,890 |
| Columns | 17 |
| Nullable Columns | 9 |
| Primary Key(s) | `patient_id` |
| Partition Column(s) | None |

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `patient_id` | `STRING` | ✗ | 🔑 | Unique patient identifier (UUID) |
| 2 | `member_id` | `STRING` | ✗ |  | Insurance member ID issued by the payer |
| 3 | `date_of_birth` | `DATE` | ✗ |  | Patient date of birth |
| 4 | `gender` | `STRING` | ✓ |  | Biological sex: M, F, U (unknown) |
| 5 | `gender_identity` | `STRING` | ✓ |  | Self-reported gender identity |
| 6 | `race_ethnicity_code` | `STRING` | ✓ |  | CDC race/ethnicity code for analytics |
| 7 | `zip_code` | `STRING` | ✓ |  | 5-digit ZIP code (last 2 digits masked for PHI) |
| 8 | `state_code` | `STRING` | ✗ |  | 2-letter US state abbreviation |
| 9 | `county_fips` | `STRING` | ✓ |  | 5-digit FIPS county code |
| 10 | `plan_type` | `STRING` | ✗ |  | Insurance plan type: HMO, PPO, EPO, HDHP, MEDICAID, MEDICARE |
| 11 | `group_number` | `STRING` | ✓ |  | Employer group number for commercial plans |
| 12 | `enrollment_start` | `DATE` | ✗ |  | Date patient enrolled in current plan |
| 13 | `enrollment_end` | `DATE` | ✓ |  | Date enrollment ended; NULL if still active |
| 14 | `primary_care_npi` | `STRING` | ✓ |  | NPI of assigned primary care physician |
| 15 | `chronic_condition_flags` | `MAP<STRING,BOOLEAN>` | ✓ |  | Map of CMS chronic condition flags (e.g. diabetes→true) |
| 16 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |
| 17 | `updated_at` | `TIMESTAMP` | ✗ |  | Row last-update timestamp (UTC) |

---

## `providers`

Dimension table of healthcare providers including physicians, hospitals, clinics, and ancillary service providers.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.providers` |
| Estimated Rows | 98,432 |
| Columns | 21 |
| Nullable Columns | 15 |
| Primary Key(s) | `provider_id` |
| Partition Column(s) | None |

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `provider_id` | `STRING` | ✗ | 🔑 | Unique provider record identifier (UUID) |
| 2 | `npi` | `STRING` | ✗ |  | 10-digit National Provider Identifier (unique business key) |
| 3 | `provider_type` | `STRING` | ✗ |  | INDIVIDUAL or ORGANIZATION |
| 4 | `taxonomy_code` | `STRING` | ✓ |  | NUCC Health Care Provider Taxonomy code |
| 5 | `specialty_description` | `STRING` | ✓ |  | Human-readable specialty (e.g. Internal Medicine) |
| 6 | `first_name` | `STRING` | ✓ |  | Provider first name (individual providers only) |
| 7 | `last_name` | `STRING` | ✓ |  | Provider last name (individual providers only) |
| 8 | `organization_name` | `STRING` | ✓ |  | Organization name (org providers only) |
| 9 | `credential` | `STRING` | ✓ |  | Clinical credential: MD, DO, NP, PA, RN, etc. |
| 10 | `address_line1` | `STRING` | ✓ |  | Practice street address line 1 |
| 11 | `address_city` | `STRING` | ✓ |  | Practice city |
| 12 | `address_state` | `STRING` | ✓ |  | Practice state (2-letter) |
| 13 | `address_zip` | `STRING` | ✓ |  | Practice ZIP code |
| 14 | `phone_number` | `STRING` | ✓ |  | Primary contact phone number |
| 15 | `network_status` | `STRING` | ✗ |  | IN_NETWORK or OUT_OF_NETWORK |
| 16 | `contract_effective` | `DATE` | ✓ |  | Date provider contract became effective |
| 17 | `contract_end` | `DATE` | ✓ |  | Date provider contract ended; NULL if active |
| 18 | `accepting_new_patients` | `BOOLEAN` | ✓ |  | Whether provider is accepting new patients |
| 19 | `quality_score` | `DECIMAL(5,2)` | ✓ |  | Composite quality score 0.00–100.00 |
| 20 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |
| 21 | `updated_at` | `TIMESTAMP` | ✗ |  | Row last-update timestamp (UTC) |

---

## `diagnoses`

Bridge table linking claims to ICD-10-CM diagnosis codes. Each claim may have multiple diagnoses; one is flagged as the principal diagnosis.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.diagnoses` |
| Estimated Rows | 24,680,201 |
| Columns | 11 |
| Nullable Columns | 4 |
| Primary Key(s) | `diagnosis_id` |
| Partition Column(s) | None |

**Foreign Keys:**

- `claim_id` → `claims.claim_id`

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `diagnosis_id` | `BIGINT` | ✗ | 🔑 | Surrogate key (auto-increment) |
| 2 | `claim_id` | `STRING` | ✗ |  | FK → claims.claim_id |
| 3 | `diagnosis_code` | `STRING` | ✗ |  | ICD-10-CM diagnosis code (e.g. E11.9 = Type 2 diabetes) |
| 4 | `diagnosis_description` | `STRING` | ✓ |  | Plain-text description of the ICD-10-CM code |
| 5 | `code_version` | `STRING` | ✗ |  | ICD code version: ICD10, ICD9 (legacy) |
| 6 | `diagnosis_type` | `STRING` | ✗ |  | PRINCIPAL, ADMITTING, or SECONDARY |
| 7 | `sequence_number` | `INT` | ✗ |  | Order of diagnosis on the claim form (1 = principal) |
| 8 | `poa_indicator` | `STRING` | ✓ |  | Present on Admission indicator: Y, N, U, W (inpatient only) |
| 9 | `chronic_flag` | `BOOLEAN` | ✓ |  | True if CMS classifies this code as a chronic condition |
| 10 | `hcc_category` | `STRING` | ✓ |  | CMS Hierarchical Condition Category mapping |
| 11 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |

---

## `procedures`

Bridge table linking claims to CPT/HCPCS procedure codes. Each row represents one line item on a claim with its associated units and revenue code.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.procedures` |
| Estimated Rows | 31,102,890 |
| Columns | 19 |
| Nullable Columns | 10 |
| Primary Key(s) | `procedure_id` |
| Partition Column(s) | None |

**Foreign Keys:**

- `claim_id` → `claims.claim_id`

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `procedure_id` | `BIGINT` | ✗ | 🔑 | Surrogate key (auto-increment) |
| 2 | `claim_id` | `STRING` | ✗ |  | FK → claims.claim_id |
| 3 | `line_number` | `INT` | ✗ |  | Claim line item number (1-based) |
| 4 | `procedure_code` | `STRING` | ✗ |  | CPT or HCPCS Level II procedure code |
| 5 | `procedure_description` | `STRING` | ✓ |  | Short description of the procedure |
| 6 | `code_type` | `STRING` | ✗ |  | CPT4, HCPCS, ICD10PCS, or CDT (dental) |
| 7 | `modifier_1` | `STRING` | ✓ |  | First CPT modifier code (e.g. 26=professional component) |
| 8 | `modifier_2` | `STRING` | ✓ |  | Second CPT modifier code |
| 9 | `revenue_code` | `STRING` | ✓ |  | UB-04 revenue code (facility claims only) |
| 10 | `drg_code` | `STRING` | ✓ |  | MS-DRG code for inpatient claims |
| 11 | `service_date` | `DATE` | ✗ |  | Date this specific service line was rendered |
| 12 | `units` | `DECIMAL(10,3)` | ✗ |  | Quantity of units/services billed on this line |
| 13 | `unit_type` | `STRING` | ✓ |  | Unit of measure: UN (units), DA (days), ML, etc. |
| 14 | `billed_amount` | `DECIMAL(12,2)` | ✗ |  | Amount billed for this procedure line |
| 15 | `allowed_amount` | `DECIMAL(12,2)` | ✓ |  | Payer-allowed amount for this line |
| 16 | `paid_amount` | `DECIMAL(12,2)` | ✓ |  | Amount paid for this line |
| 17 | `rendering_npi` | `STRING` | ✓ |  | NPI of provider who actually rendered the service |
| 18 | `ndc_code` | `STRING` | ✓ |  | National Drug Code (pharmacy/drug claims only) |
| 19 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |

---

## `payments`

Tracks all payment transactions associated with claims including insurer payments, patient payments, adjustments, and refunds.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.payments` |
| Estimated Rows | 9,874,112 |
| Columns | 16 |
| Nullable Columns | 7 |
| Primary Key(s) | `payment_id` |
| Partition Column(s) | None |

**Foreign Keys:**

- `claim_id` → `claims.claim_id`

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `payment_id` | `STRING` | ✗ | 🔑 | Unique payment transaction identifier (UUID) |
| 2 | `claim_id` | `STRING` | ✗ |  | FK → claims.claim_id |
| 3 | `payment_type` | `STRING` | ✗ |  | INSURER_PAYMENT, PATIENT_PAYMENT, ADJUSTMENT, REFUND, WRITE_OFF |
| 4 | `payment_amount` | `DECIMAL(12,2)` | ✗ |  | Payment amount (negative for refunds/adjustments) |
| 5 | `payment_date` | `DATE` | ✗ |  | Date payment was issued or posted |
| 6 | `payment_method` | `STRING` | ✓ |  | EFT, CHECK, CREDIT_CARD, CASH, ERA |
| 7 | `check_number` | `STRING` | ✓ |  | Check or EFT trace number |
| 8 | `remittance_advice_id` | `STRING` | ✓ |  | 835 ERA transaction ID |
| 9 | `payer_id` | `STRING` | ✗ |  | Payer/insurer identifier |
| 10 | `payer_name` | `STRING` | ✓ |  | Payer display name |
| 11 | `adjustment_reason_code` | `STRING` | ✓ |  | CARC adjustment reason code (for ADJUSTMENT type) |
| 12 | `adjustment_group_code` | `STRING` | ✓ |  | ANSI X12 group code: CO, PR, OA, PI, CR |
| 13 | `is_reconciled` | `BOOLEAN` | ✗ |  | Whether this payment has been reconciled to the GL |
| 14 | `gl_posting_date` | `DATE` | ✓ |  | Date payment was posted to the general ledger |
| 15 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |
| 16 | `updated_at` | `TIMESTAMP` | ✗ |  | Row last-update timestamp (UTC) |

---

## `claim_audits`

Audit trail capturing every status change and adjudication event on a claim. Enables full lifecycle tracking and compliance reporting.

| Property | Value |
|----------|-------|
| Full Name | `hive_metastore.healthcare_claims.claim_audits` |
| Estimated Rows | 42,315,670 |
| Columns | 12 |
| Nullable Columns | 7 |
| Primary Key(s) | `audit_id` |
| Partition Column(s) | None |

**Foreign Keys:**

- `claim_id` → `claims.claim_id`

### Columns

| # | Column Name | Data Type | Nullable | PK | Description |
|---|-------------|-----------|----------|----|-------------|
| 1 | `audit_id` | `BIGINT` | ✗ | 🔑 | Surrogate key (auto-increment) |
| 2 | `claim_id` | `STRING` | ✗ |  | FK → claims.claim_id |
| 3 | `event_type` | `STRING` | ✗ |  | Type of event: STATUS_CHANGE, PAYMENT, EDIT, APPEAL, NOTE |
| 4 | `old_status` | `STRING` | ✓ |  | Claim status before this event |
| 5 | `new_status` | `STRING` | ✓ |  | Claim status after this event |
| 6 | `event_timestamp` | `TIMESTAMP` | ✗ |  | UTC timestamp of the event |
| 7 | `actor_id` | `STRING` | ✓ |  | User ID or system ID that triggered the event |
| 8 | `actor_type` | `STRING` | ✓ |  | HUMAN, SYSTEM, PAYER_INTERFACE |
| 9 | `notes` | `STRING` | ✓ |  | Free-text notes or reason for the event |
| 10 | `metadata` | `MAP<STRING,STRING>` | ✓ |  | Arbitrary key-value metadata for the event |
| 11 | `source_system` | `STRING` | ✓ |  | Originating system: CLAIMS_MGMT, PAYER_PORTAL, BATCH_JOB |
| 12 | `created_at` | `TIMESTAMP` | ✗ |  | Row insert timestamp (UTC) |

---

## Appendix: Code Value Dictionaries

### `claims.claim_status`

| Value | Description |
|-------|-------------|
| `SUBMITTED` | Claim received by payer, awaiting review |
| `PENDING` | Under review / additional information requested |
| `APPROVED` | Adjudicated and approved for payment |
| `DENIED` | Adjudicated and denied |
| `PAID` | Payment issued to provider |
| `APPEALED` | Provider has filed an appeal |

### `claims.claim_type`

| Value | Description |
|-------|-------------|
| `MEDICAL` | Physician or outpatient medical service |
| `DENTAL` | Dental services (CDT codes) |
| `VISION` | Vision/optical services |
| `PHARMACY` | Prescription drug claims |

### `providers.network_status`

| Value | Description |
|-------|-------------|
| `IN_NETWORK` | Provider has a contract with the payer |
| `OUT_OF_NETWORK` | No contract; higher cost-sharing for patient |

### `payments.adjustment_group_code` (ANSI X12)

| Code | Description |
|------|-------------|
| `CO` | Contractual Obligation — provider write-off |
| `PR` | Patient Responsibility — copay/deductible/coinsurance |
| `OA` | Other Adjustments |
| `PI` | Payer Initiated |
| `CR` | Correction/Reversal |

---

*Documentation generated automatically by the DataEngineer agent · 2026-03-09 06:21:24 UTC*
