# Databricks Schema Documentation

**Catalog:** `workspace`  
**Schema:** `healthcare_claims`  
**Generated:** 2026-03-09 06:40:18  

---

## Summary

**Total Tables:** 13  
**Total Columns:** 195  

### Tables

| Table Name | Type | Columns | Description |
|------------|------|---------|-------------|
| `members` | MANAGED | 16 | Contains member/patient demographic and enrollment information |
| `eligibility` | MANAGED | 13 | Tracks member insurance eligibility periods |
| `claims` | MANAGED | 27 | Main claims header table containing all healthcare claim records |
| `claim_lines` | MANAGED | 20 | Individual service line items for each claim |
| `providers` | MANAGED | 21 | Healthcare provider information including physicians, hospitals, and facilities |
| `diagnoses` | MANAGED | 8 | Diagnosis codes (ICD-10) associated with each claim |
| `procedures` | MANAGED | 8 | ICD-10 procedure codes for inpatient claims |
| `pharmacy_claims` | MANAGED | 22 | Pharmacy/prescription drug claims data |
| `remittance` | MANAGED | 11 | Payment remittance advices (835 ERA transactions) |
| `authorizations` | MANAGED | 16 | Prior authorization requests and decisions |
| `claim_adjustments` | MANAGED | 11 | Tracks claim adjustments, reversals, and resubmissions |
| `icd_codes` | MANAGED | 10 | Reference table for ICD-10 diagnosis and procedure codes |
| `cpt_codes` | MANAGED | 12 | Reference table for CPT/HCPCS procedure codes |

---

## Table: `members`

**Type:** MANAGED  
**Columns:** 16  
**Description:** Contains member/patient demographic and enrollment information  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `member_id` | `STRING` | ✗ | Unique identifier for each member |
| `first_name` | `STRING` | ✗ | Member first name |
| `last_name` | `STRING` | ✗ | Member last name |
| `date_of_birth` | `DATE` | ✗ | Member date of birth |
| `gender` | `STRING` | ✓ | Member gender (M/F/U) |
| `ssn` | `STRING` | ✓ | Social security number (masked) |
| `address_line1` | `STRING` | ✓ | Primary address line |
| `address_line2` | `STRING` | ✓ | Secondary address line |
| `city` | `STRING` | ✓ | City of residence |
| `state` | `STRING` | ✓ | State of residence (2-letter code) |
| `zip_code` | `STRING` | ✓ | ZIP/postal code |
| `phone_number` | `STRING` | ✓ | Primary contact phone number |
| `email` | `STRING` | ✓ | Member email address |
| `member_status` | `STRING` | ✗ | Active/Inactive/Terminated |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |
| `updated_date` | `TIMESTAMP` | ✓ | Last record update timestamp |

---

## Table: `eligibility`

**Type:** MANAGED  
**Columns:** 13  
**Description:** Tracks member insurance eligibility periods  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `eligibility_id` | `BIGINT` | ✗ | Unique eligibility record ID |
| `member_id` | `STRING` | ✗ | Foreign key to members table |
| `plan_id` | `STRING` | ✗ | Insurance plan identifier |
| `group_id` | `STRING` | ✓ | Employer group identifier |
| `effective_date` | `DATE` | ✗ | Start date of eligibility |
| `termination_date` | `DATE` | ✓ | End date of eligibility (NULL if active) |
| `coverage_type` | `STRING` | ✗ | Medical/Dental/Vision/Pharmacy |
| `subscriber_id` | `STRING` | ✗ | Primary subscriber ID |
| `relationship_code` | `STRING` | ✗ | Member relationship to subscriber (Self/Spouse/Child) |
| `payer_id` | `STRING` | ✗ | Insurance payer identifier |
| `network_id` | `STRING` | ✓ | Network or HMO identifier |
| `premium_amount` | `DECIMAL(10,2)` | ✓ | Monthly premium amount |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `claims`

**Type:** MANAGED  
**Columns:** 27  
**Description:** Main claims header table containing all healthcare claim records  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `claim_id` | `STRING` | ✗ | Unique claim identifier |
| `member_id` | `STRING` | ✗ | Foreign key to members table |
| `provider_id` | `STRING` | ✗ | Foreign key to providers table |
| `facility_id` | `STRING` | ✓ | Foreign key to facilities table |
| `claim_type` | `STRING` | ✗ | Medical/Dental/Vision/Pharmacy |
| `claim_status` | `STRING` | ✗ | Paid/Denied/Pending/Adjusted |
| `service_date_from` | `DATE` | ✗ | Service start date |
| `service_date_to` | `DATE` | ✗ | Service end date |
| `admission_date` | `DATE` | ✓ | Hospital admission date (inpatient only) |
| `discharge_date` | `DATE` | ✓ | Hospital discharge date (inpatient only) |
| `received_date` | `DATE` | ✗ | Date claim was received |
| `processed_date` | `DATE` | ✓ | Date claim was processed |
| `billed_amount` | `DECIMAL(12,2)` | ✗ | Total amount billed by provider |
| `allowed_amount` | `DECIMAL(12,2)` | ✓ | Allowed amount per contract |
| `paid_amount` | `DECIMAL(12,2)` | ✓ | Total amount paid by payer |
| `member_responsibility` | `DECIMAL(12,2)` | ✓ | Amount owed by member (copay + deductible + coinsurance) |
| `deductible_amount` | `DECIMAL(10,2)` | ✓ | Deductible applied to claim |
| `copay_amount` | `DECIMAL(10,2)` | ✓ | Copay amount |
| `coinsurance_amount` | `DECIMAL(10,2)` | ✓ | Coinsurance amount |
| `place_of_service` | `STRING` | ✓ | Place of service code |
| `bill_type` | `STRING` | ✓ | UB-04 bill type code (institutional) |
| `drg_code` | `STRING` | ✓ | Diagnosis related group code |
| `npi` | `STRING` | ✓ | National provider identifier |
| `taxonomy_code` | `STRING` | ✓ | Provider taxonomy code |
| `claim_source` | `STRING` | ✓ | EDI/Manual/Portal |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |
| `updated_date` | `TIMESTAMP` | ✓ | Last record update timestamp |

---

## Table: `claim_lines`

**Type:** MANAGED  
**Columns:** 20  
**Description:** Individual service line items for each claim  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `claim_line_id` | `BIGINT` | ✗ | Unique claim line identifier |
| `claim_id` | `STRING` | ✗ | Foreign key to claims table |
| `line_number` | `INT` | ✗ | Service line sequence number |
| `service_date` | `DATE` | ✗ | Date of service for this line |
| `procedure_code` | `STRING` | ✗ | CPT/HCPCS procedure code |
| `procedure_code_qualifier` | `STRING` | ✓ | Procedure code qualifier (HC/IV/etc) |
| `revenue_code` | `STRING` | ✓ | UB-04 revenue code |
| `modifier1` | `STRING` | ✓ | Procedure modifier 1 |
| `modifier2` | `STRING` | ✓ | Procedure modifier 2 |
| `modifier3` | `STRING` | ✓ | Procedure modifier 3 |
| `modifier4` | `STRING` | ✓ | Procedure modifier 4 |
| `units` | `DECIMAL(8,2)` | ✗ | Units/quantity of service |
| `unit_type` | `STRING` | ✓ | Unit type (Days/Units/Minutes) |
| `billed_amount` | `DECIMAL(12,2)` | ✗ | Line-level billed amount |
| `allowed_amount` | `DECIMAL(12,2)` | ✓ | Line-level allowed amount |
| `paid_amount` | `DECIMAL(12,2)` | ✓ | Line-level paid amount |
| `line_status` | `STRING` | ✗ | Paid/Denied/Adjusted |
| `denial_reason_code` | `STRING` | ✓ | Denial reason code if denied |
| `ndc_code` | `STRING` | ✓ | National Drug Code (pharmacy lines) |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `providers`

**Type:** MANAGED  
**Columns:** 21  
**Description:** Healthcare provider information including physicians, hospitals, and facilities  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `provider_id` | `STRING` | ✗ | Unique provider identifier |
| `npi` | `STRING` | ✗ | National Provider Identifier (10-digit) |
| `provider_type` | `STRING` | ✗ | Individual/Organization/Facility |
| `first_name` | `STRING` | ✓ | Provider first name (individual only) |
| `last_name` | `STRING` | ✓ | Provider last name (individual only) |
| `organization_name` | `STRING` | ✓ | Organization name (org only) |
| `taxonomy_code` | `STRING` | ✓ | Provider specialty taxonomy code |
| `specialty` | `STRING` | ✓ | Medical specialty description |
| `address_line1` | `STRING` | ✓ | Provider address line 1 |
| `address_line2` | `STRING` | ✓ | Provider address line 2 |
| `city` | `STRING` | ✓ | Provider city |
| `state` | `STRING` | ✓ | Provider state |
| `zip_code` | `STRING` | ✓ | Provider ZIP code |
| `phone_number` | `STRING` | ✓ | Provider phone number |
| `fax_number` | `STRING` | ✓ | Provider fax number |
| `tin` | `STRING` | ✓ | Tax Identification Number |
| `network_status` | `STRING` | ✗ | In-Network/Out-of-Network |
| `effective_date` | `DATE` | ✓ | Provider effective date in network |
| `termination_date` | `DATE` | ✓ | Provider termination date from network |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |
| `updated_date` | `TIMESTAMP` | ✓ | Last record update timestamp |

---

## Table: `diagnoses`

**Type:** MANAGED  
**Columns:** 8  
**Description:** Diagnosis codes (ICD-10) associated with each claim  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `diagnosis_id` | `BIGINT` | ✗ | Unique diagnosis record ID |
| `claim_id` | `STRING` | ✗ | Foreign key to claims table |
| `diagnosis_code` | `STRING` | ✗ | ICD-10-CM diagnosis code |
| `diagnosis_code_qualifier` | `STRING` | ✗ | Code qualifier (ABK=Principal, ABF=Other) |
| `sequence_number` | `INT` | ✗ | Diagnosis sequence (1=principal) |
| `poa_indicator` | `STRING` | ✓ | Present on Admission indicator (Y/N/U/W) |
| `description` | `STRING` | ✓ | Diagnosis code description |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `procedures`

**Type:** MANAGED  
**Columns:** 8  
**Description:** ICD-10 procedure codes for inpatient claims  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `procedure_id` | `BIGINT` | ✗ | Unique procedure record ID |
| `claim_id` | `STRING` | ✗ | Foreign key to claims table |
| `procedure_code` | `STRING` | ✗ | ICD-10-PCS procedure code |
| `procedure_code_qualifier` | `STRING` | ✗ | Code qualifier (BBR=Principal, BBQ=Other) |
| `sequence_number` | `INT` | ✗ | Procedure sequence (1=principal) |
| `procedure_date` | `DATE` | ✓ | Date procedure was performed |
| `description` | `STRING` | ✓ | Procedure code description |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `pharmacy_claims`

**Type:** MANAGED  
**Columns:** 22  
**Description:** Pharmacy/prescription drug claims data  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `rx_claim_id` | `STRING` | ✗ | Unique pharmacy claim identifier |
| `member_id` | `STRING` | ✗ | Foreign key to members table |
| `prescriber_npi` | `STRING` | ✓ | Prescribing physician NPI |
| `pharmacy_npi` | `STRING` | ✓ | Dispensing pharmacy NPI |
| `ndc_code` | `STRING` | ✗ | National Drug Code (11-digit) |
| `drug_name` | `STRING` | ✓ | Brand/generic drug name |
| `generic_name` | `STRING` | ✓ | Generic drug name |
| `drug_strength` | `STRING` | ✓ | Drug dosage strength |
| `dosage_form` | `STRING` | ✓ | Tablet/Capsule/Liquid/etc |
| `days_supply` | `INT` | ✗ | Days supply dispensed |
| `quantity_dispensed` | `DECIMAL(10,3)` | ✗ | Quantity dispensed |
| `fill_date` | `DATE` | ✗ | Date prescription was filled |
| `written_date` | `DATE` | ✓ | Date prescription was written |
| `refill_number` | `INT` | ✗ | Refill number (0=original) |
| `claim_status` | `STRING` | ✗ | Paid/Rejected/Reversed |
| `billed_amount` | `DECIMAL(10,2)` | ✗ | Amount billed by pharmacy |
| `allowed_amount` | `DECIMAL(10,2)` | ✓ | Allowed amount per contract |
| `paid_amount` | `DECIMAL(10,2)` | ✓ | Amount paid by payer |
| `member_copay` | `DECIMAL(10,2)` | ✓ | Member copay amount |
| `formulary_status` | `STRING` | ✓ | Formulary tier/status |
| `therapeutic_class` | `STRING` | ✓ | Drug therapeutic class |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `remittance`

**Type:** MANAGED  
**Columns:** 11  
**Description:** Payment remittance advices (835 ERA transactions)  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `remittance_id` | `STRING` | ✗ | Unique remittance identifier |
| `claim_id` | `STRING` | ✗ | Foreign key to claims table |
| `payer_id` | `STRING` | ✗ | Payer identifier |
| `check_number` | `STRING` | ✓ | Check or EFT trace number |
| `payment_date` | `DATE` | ✗ | Date payment was issued |
| `payment_method` | `STRING` | ✗ | Check/EFT/Credit |
| `payment_amount` | `DECIMAL(12,2)` | ✗ | Total payment amount |
| `adjustment_reason_code` | `STRING` | ✓ | CARC/RARC adjustment reason codes |
| `adjustment_amount` | `DECIMAL(12,2)` | ✓ | Adjustment amount |
| `provider_id` | `STRING` | ✗ | Foreign key to providers table |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `authorizations`

**Type:** MANAGED  
**Columns:** 16  
**Description:** Prior authorization requests and decisions  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `auth_id` | `STRING` | ✗ | Unique authorization identifier |
| `member_id` | `STRING` | ✗ | Foreign key to members table |
| `provider_id` | `STRING` | ✗ | Requesting provider ID |
| `auth_type` | `STRING` | ✗ | Inpatient/Outpatient/Referral/Pharmacy |
| `status` | `STRING` | ✗ | Approved/Denied/Pending/Withdrawn |
| `requested_date` | `DATE` | ✗ | Date authorization was requested |
| `decision_date` | `DATE` | ✓ | Date decision was made |
| `effective_date` | `DATE` | ✓ | Authorization start date |
| `expiration_date` | `DATE` | ✓ | Authorization expiration date |
| `procedure_code` | `STRING` | ✓ | CPT/HCPCS code requiring auth |
| `diagnosis_code` | `STRING` | ✓ | Supporting diagnosis code |
| `approved_units` | `INT` | ✓ | Approved units/visits |
| `denial_reason` | `STRING` | ✓ | Denial reason code/description |
| `notes` | `STRING` | ✓ | Clinical notes |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |
| `updated_date` | `TIMESTAMP` | ✓ | Last record update timestamp |

---

## Table: `claim_adjustments`

**Type:** MANAGED  
**Columns:** 11  
**Description:** Tracks claim adjustments, reversals, and resubmissions  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `adjustment_id` | `BIGINT` | ✗ | Unique adjustment record ID |
| `original_claim_id` | `STRING` | ✗ | Original claim being adjusted |
| `adjusted_claim_id` | `STRING` | ✓ | New/replacement claim ID |
| `adjustment_type` | `STRING` | ✗ | Adjustment/Reversal/Resubmission |
| `adjustment_reason` | `STRING` | ✗ | Reason for adjustment |
| `adjustment_date` | `DATE` | ✗ | Date adjustment was processed |
| `original_paid_amount` | `DECIMAL(12,2)` | ✓ | Original payment amount |
| `adjusted_paid_amount` | `DECIMAL(12,2)` | ✓ | New payment amount after adjustment |
| `net_adjustment` | `DECIMAL(12,2)` | ✓ | Net change in payment amount |
| `adjuster_id` | `STRING` | ✓ | ID of adjuster who made the change |
| `created_date` | `TIMESTAMP` | ✗ | Record creation timestamp |

---

## Table: `icd_codes`

**Type:** MANAGED  
**Columns:** 10  
**Description:** Reference table for ICD-10 diagnosis and procedure codes  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `code_id` | `BIGINT` | ✗ | Unique code record ID |
| `code_type` | `STRING` | ✗ | Diagnosis/Procedure |
| `icd_code` | `STRING` | ✗ | ICD-10 code |
| `short_description` | `STRING` | ✗ | Short code description |
| `long_description` | `STRING` | ✓ | Full code description |
| `category` | `STRING` | ✓ | Disease/condition category |
| `icd_version` | `STRING` | ✗ | ICD version (10-CM / 10-PCS) |
| `effective_date` | `DATE` | ✗ | Code effective date |
| `expiration_date` | `DATE` | ✓ | Code expiration date |
| `is_active` | `BOOLEAN` | ✗ | Whether code is currently active |

---

## Table: `cpt_codes`

**Type:** MANAGED  
**Columns:** 12  
**Description:** Reference table for CPT/HCPCS procedure codes  

### Schema

| Column Name | Data Type | Nullable | Comment |
|-------------|-----------|----------|---------|
| `code_id` | `BIGINT` | ✗ | Unique code record ID |
| `procedure_code` | `STRING` | ✗ | CPT or HCPCS Level II code |
| `code_type` | `STRING` | ✗ | CPT/HCPCS |
| `short_description` | `STRING` | ✗ | Short procedure description |
| `long_description` | `STRING` | ✓ | Full procedure description |
| `category` | `STRING` | ✓ | Procedure category/section |
| `rvu_work` | `DECIMAL(8,2)` | ✓ | Relative value unit - work component |
| `rvu_practice_expense` | `DECIMAL(8,2)` | ✓ | Relative value unit - practice expense |
| `rvu_malpractice` | `DECIMAL(8,2)` | ✓ | Relative value unit - malpractice |
| `effective_date` | `DATE` | ✗ | Code effective date |
| `expiration_date` | `DATE` | ✓ | Code expiration date |
| `is_active` | `BOOLEAN` | ✗ | Whether code is currently active |

---

## Summary

- **Total Tables:** 13
- **Total Columns:** 195
- **Generated:** 2026-03-09 06:40:18
