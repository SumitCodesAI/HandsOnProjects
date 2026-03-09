# Schema Documentation: `workspace`.`healthcare_claims`

> **Catalog:** `workspace`  
> **Schema:** `healthcare_claims`  
> **Generated:** 2026-03-09 05:15:27 UTC  
> **Tables:** 8  
> **Total Columns:** 244

---

## Table of Contents

1. [claims](#claims) — 31 columns
2. [members](#members) — 30 columns
3. [providers](#providers) — 32 columns
4. [diagnoses](#diagnoses) — 20 columns
5. [procedures](#procedures) — 22 columns
6. [claim_lines](#claim_lines) — 31 columns
7. [eligibility](#eligibility) — 34 columns
8. [pharmacy_claims](#pharmacy_claims) — 44 columns

---

## Summary

| # | Table Name | Columns | Description |
|---|-----------|---------|-------------|
| 1 | `claims` | 31 | Main claims table storing all submitted healthcare insurance claims. |
| 2 | `members` | 30 | Insurance members and patients enrolled in health plans. |
| 3 | `providers` | 32 | Healthcare providers including physicians, hospitals, and ancillary facilities. |
| 4 | `diagnoses` | 20 | ICD-10-CM diagnosis code reference table with clinical descriptions. |
| 5 | `procedures` | 22 | CPT/HCPCS procedure code reference table for medical services and supplies. |
| 6 | `claim_lines` | 31 | Individual service line items (detail lines) within a parent claim. |
| 7 | `eligibility` | 34 | Member insurance eligibility and benefit coverage records by coverage period. |
| 8 | `pharmacy_claims` | 44 | Pharmacy and prescription drug claims processed through the pharmacy benefit manager (PBM). |

---

## claims

**Description:** Main claims table storing all submitted healthcare insurance claims.  
**Full Name:** `workspace`.`healthcare_claims`.`claims`  
**Column Count:** 31

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `claim_id` | `STRING` | NO | 1 | Unique identifier for the claim (UUID/surrogate key) |
| `claim_number` | `STRING` | NO | 2 | Human-readable external claim reference number |
| `member_id` | `STRING` | NO | 3 | Foreign key referencing members.member_id |
| `provider_id` | `STRING` | NO | 4 | Foreign key referencing providers.provider_id |
| `payer_id` | `STRING` | NO | 5 | Insurance payer / plan identifier |
| `claim_type` | `STRING` | YES | 6 | Claim type code: MEDICAL, DENTAL, VISION, BEHAVIORAL |
| `service_from_date` | `DATE` | NO | 7 | Start date of the service period (YYYY-MM-DD) |
| `service_to_date` | `DATE` | NO | 8 | End date of the service period (YYYY-MM-DD) |
| `claim_submit_date` | `DATE` | YES | 9 | Date the claim was submitted to the payer |
| `claim_status` | `STRING` | NO | 10 | Current status: SUBMITTED, ADJUDICATED, DENIED, PAID, VOID |
| `place_of_service` | `STRING` | YES | 11 | CMS Place of Service code (e.g. 11=Office, 21=Inpatient) |
| `bill_type_code` | `STRING` | YES | 12 | UB-04 bill type code for facility claims |
| `total_billed_amt` | `DOUBLE` | NO | 13 | Total amount billed by the provider (USD) |
| `allowed_amt` | `DOUBLE` | YES | 14 | Contractually allowed amount after network discount |
| `paid_amt` | `DOUBLE` | YES | 15 | Actual amount paid to the provider (USD) |
| `member_liability` | `DOUBLE` | YES | 16 | Patient responsibility: copay + coinsurance + deductible |
| `deductible_amt` | `DOUBLE` | YES | 17 | Amount applied to the member deductible |
| `copay_amt` | `DOUBLE` | YES | 18 | Copayment amount collected at point of service |
| `coinsurance_amt` | `DOUBLE` | YES | 19 | Coinsurance amount owed by the member |
| `denial_reason_code` | `STRING` | YES | 20 | ANSI claim adjustment reason code if denied |
| `npi` | `STRING` | YES | 21 | Rendering provider National Provider Identifier (10 digits) |
| `taxonomy_code` | `STRING` | YES | 22 | Provider specialty taxonomy code |
| `drg_code` | `STRING` | YES | 23 | Diagnosis Related Group code for inpatient claims |
| `admission_date` | `DATE` | YES | 24 | Hospital admission date (inpatient claims only) |
| `discharge_date` | `DATE` | YES | 25 | Hospital discharge date (inpatient claims only) |
| `discharge_status` | `STRING` | YES | 26 | Patient discharge status code (UB-04 FL 17) |
| `is_out_of_network` | `BOOLEAN` | YES | 27 | TRUE if rendered by an out-of-network provider |
| `coordination_of_benefits` | `STRING` | YES | 28 | COB indicator: PRIMARY, SECONDARY, TERTIARY |
| `claim_source` | `STRING` | YES | 29 | Ingestion source system: EDI_837, MANUAL, PORTAL |
| `created_at` | `TIMESTAMP` | NO | 30 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 31 | Record last-update timestamp (UTC) |

---

## members

**Description:** Insurance members and patients enrolled in health plans.  
**Full Name:** `workspace`.`healthcare_claims`.`members`  
**Column Count:** 30

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `member_id` | `STRING` | NO | 1 | Unique member identifier (UUID) |
| `subscriber_id` | `STRING` | NO | 2 | Insurance subscriber / policy holder ID |
| `group_number` | `STRING` | YES | 3 | Employer group number associated with the plan |
| `plan_id` | `STRING` | YES | 4 | Health plan identifier |
| `first_name` | `STRING` | NO | 5 | Member legal first name |
| `last_name` | `STRING` | NO | 6 | Member legal last name |
| `middle_name` | `STRING` | YES | 7 | Member middle name or initial |
| `date_of_birth` | `DATE` | NO | 8 | Member date of birth (YYYY-MM-DD) |
| `gender` | `STRING` | YES | 9 | Gender code: M=Male, F=Female, U=Unknown, O=Other |
| `ssn_hash` | `STRING` | YES | 10 | SHA-256 hash of Social Security Number (PII masked) |
| `address_line1` | `STRING` | YES | 11 | Street address line 1 |
| `address_line2` | `STRING` | YES | 12 | Street address line 2 (apt, suite, etc.) |
| `city` | `STRING` | YES | 13 | City of residence |
| `state` | `STRING` | YES | 14 | Two-letter US state code |
| `zip_code` | `STRING` | YES | 15 | 5 or 9 digit postal zip code |
| `county` | `STRING` | YES | 16 | County of residence |
| `phone_number` | `STRING` | YES | 17 | Primary contact phone number |
| `email_address` | `STRING` | YES | 18 | Contact email address (PII) |
| `relationship_code` | `STRING` | YES | 19 | Relationship to subscriber: 18=Self, 01=Spouse, 19=Child |
| `medicaid_id` | `STRING` | YES | 20 | State Medicaid identifier if dual-eligible |
| `medicare_id` | `STRING` | YES | 21 | Medicare Beneficiary Identifier (MBI) |
| `race_code` | `STRING` | YES | 22 | Race code per OMB standards (SDOH) |
| `ethnicity_code` | `STRING` | YES | 23 | Ethnicity code per OMB standards (SDOH) |
| `language_code` | `STRING` | YES | 24 | Preferred language ISO 639-1 code |
| `pcp_provider_id` | `STRING` | YES | 25 | Primary Care Provider (PCP) assignment |
| `effective_date` | `DATE` | NO | 26 | Coverage effective start date |
| `termination_date` | `DATE` | YES | 27 | Coverage termination date (NULL if active) |
| `is_active` | `BOOLEAN` | NO | 28 | TRUE if member has active coverage today |
| `created_at` | `TIMESTAMP` | NO | 29 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 30 | Record last-update timestamp (UTC) |

---

## providers

**Description:** Healthcare providers including physicians, hospitals, and ancillary facilities.  
**Full Name:** `workspace`.`healthcare_claims`.`providers`  
**Column Count:** 32

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `provider_id` | `STRING` | NO | 1 | Unique provider identifier (UUID) |
| `npi` | `STRING` | NO | 2 | National Provider Identifier (10-digit NPI-1 or NPI-2) |
| `provider_type` | `STRING` | NO | 3 | Provider category: INDIVIDUAL, ORGANIZATION |
| `first_name` | `STRING` | YES | 4 | Provider first name (individual only) |
| `last_name` | `STRING` | YES | 5 | Provider last name (individual only) |
| `organization_name` | `STRING` | YES | 6 | Organization / facility legal name |
| `doing_business_as` | `STRING` | YES | 7 | DBA trade name |
| `tin` | `STRING` | YES | 8 | Tax Identification Number (masked: ***-**-XXXX) |
| `taxonomy_code` | `STRING` | YES | 9 | Primary CMS taxonomy specialty code |
| `taxonomy_desc` | `STRING` | YES | 10 | Human-readable taxonomy description |
| `specialty_code` | `STRING` | YES | 11 | Payer-internal specialty code |
| `specialty_desc` | `STRING` | YES | 12 | Payer-internal specialty description |
| `license_number` | `STRING` | YES | 13 | State professional license number |
| `license_state` | `STRING` | YES | 14 | State that issued the license (2-char code) |
| `address_line1` | `STRING` | YES | 15 | Primary practice address line 1 |
| `address_line2` | `STRING` | YES | 16 | Primary practice address line 2 |
| `city` | `STRING` | YES | 17 | City of primary practice location |
| `state` | `STRING` | YES | 18 | State of primary practice location (2-char) |
| `zip_code` | `STRING` | YES | 19 | Zip code of primary practice location |
| `phone_number` | `STRING` | YES | 20 | Primary office phone number |
| `fax_number` | `STRING` | YES | 21 | Office fax number |
| `network_status` | `STRING` | NO | 22 | Network participation: IN_NETWORK, OUT_OF_NETWORK |
| `contract_start_date` | `DATE` | YES | 23 | Date provider contracted with the payer |
| `contract_end_date` | `DATE` | YES | 24 | Contract expiration date (NULL if active) |
| `is_accepting_patients` | `BOOLEAN` | YES | 25 | TRUE if provider is accepting new patients |
| `board_certified` | `BOOLEAN` | YES | 26 | TRUE if provider is board-certified in specialty |
| `hospital_affiliations` | `STRING` | YES | 27 | Pipe-delimited list of affiliated hospital NPIs |
| `languages_spoken` | `STRING` | YES | 28 | Comma-separated ISO language codes |
| `gender` | `STRING` | YES | 29 | Provider gender for patient preference matching |
| `credential` | `STRING` | YES | 30 | Professional credential suffix: MD, DO, NP, PA, RN |
| `created_at` | `TIMESTAMP` | NO | 31 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 32 | Record last-update timestamp (UTC) |

---

## diagnoses

**Description:** ICD-10-CM diagnosis code reference table with clinical descriptions.  
**Full Name:** `workspace`.`healthcare_claims`.`diagnoses`  
**Column Count:** 20

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `diagnosis_id` | `STRING` | NO | 1 | Surrogate key (UUID) for the diagnosis record |
| `icd_code` | `STRING` | NO | 2 | ICD-10-CM diagnosis code (e.g. E11.9, J45.50) |
| `icd_version` | `STRING` | NO | 3 | ICD version: ICD-10-CM, ICD-9-CM |
| `short_description` | `STRING` | NO | 4 | Abbreviated clinical diagnosis description |
| `long_description` | `STRING` | YES | 5 | Full official ICD-10-CM code description |
| `category_code` | `STRING` | YES | 6 | ICD chapter/block category code (e.g. E11) |
| `category_desc` | `STRING` | YES | 7 | Chapter/block category description |
| `chapter_number` | `INT` | YES | 8 | ICD-10-CM chapter number (1-22) |
| `chapter_desc` | `STRING` | YES | 9 | ICD-10-CM chapter title |
| `is_billable` | `BOOLEAN` | NO | 10 | TRUE if code is valid for claim submission |
| `is_header_code` | `BOOLEAN` | YES | 11 | TRUE if code is a category header (not billable) |
| `cms_hcc_code` | `STRING` | YES | 12 | CMS Hierarchical Condition Category mapping |
| `cms_hcc_version` | `STRING` | YES | 13 | HCC model version (e.g. V24, V28) |
| `chronic_condition` | `BOOLEAN` | YES | 14 | TRUE if classified as a chronic condition |
| `mental_health_flag` | `BOOLEAN` | YES | 15 | TRUE if behavioral / mental health diagnosis |
| `substance_abuse_flag` | `BOOLEAN` | YES | 16 | TRUE if substance use disorder diagnosis |
| `effective_date` | `DATE` | NO | 17 | Date the ICD code became effective |
| `termination_date` | `DATE` | YES | 18 | Date the ICD code was retired (NULL if active) |
| `created_at` | `TIMESTAMP` | NO | 19 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 20 | Record last-update timestamp (UTC) |

---

## procedures

**Description:** CPT/HCPCS procedure code reference table for medical services and supplies.  
**Full Name:** `workspace`.`healthcare_claims`.`procedures`  
**Column Count:** 22

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `procedure_id` | `STRING` | NO | 1 | Surrogate key (UUID) for the procedure record |
| `procedure_code` | `STRING` | NO | 2 | CPT or HCPCS Level II procedure code |
| `code_type` | `STRING` | NO | 3 | Code system: CPT, HCPCS_II, ICD10PCS |
| `short_description` | `STRING` | NO | 4 | Abbreviated procedure description |
| `long_description` | `STRING` | YES | 5 | Full official procedure code description |
| `category` | `STRING` | YES | 6 | CPT category: E&M, Surgery, Radiology, Pathology, Medicine |
| `subcategory` | `STRING` | YES | 7 | CPT subcategory / section heading |
| `rvu_work` | `DOUBLE` | YES | 8 | CMS Relative Value Unit - physician work component |
| `rvu_practice` | `DOUBLE` | YES | 9 | CMS RVU - practice expense component |
| `rvu_malpractice` | `DOUBLE` | YES | 10 | CMS RVU - malpractice insurance component |
| `total_rvu` | `DOUBLE` | YES | 11 | Total RVU (work + practice + malpractice) |
| `global_days` | `STRING` | YES | 12 | CMS global surgery days: 000, 010, 090, MMM, YYY, ZZZ |
| `modifier_applicable` | `BOOLEAN` | YES | 13 | TRUE if modifiers may be appended to this code |
| `bilateral_flag` | `BOOLEAN` | YES | 14 | TRUE if bilateral procedure (affects reimbursement) |
| `assistant_at_surgery` | `STRING` | YES | 15 | CMS assistant-at-surgery indicator: 0-2 |
| `co_surgeon_flag` | `BOOLEAN` | YES | 16 | TRUE if co-surgeon is payable for this procedure |
| `anesthesia_base_units` | `INT` | YES | 17 | Number of anesthesia base units (anesthesia codes) |
| `place_of_service_applicable` | `BOOLEAN` | YES | 18 | TRUE if POS code affects reimbursement |
| `effective_date` | `DATE` | NO | 19 | Date the procedure code became effective |
| `termination_date` | `DATE` | YES | 20 | Date the procedure code was retired (NULL if active) |
| `created_at` | `TIMESTAMP` | NO | 21 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 22 | Record last-update timestamp (UTC) |

---

## claim_lines

**Description:** Individual service line items (detail lines) within a parent claim.  
**Full Name:** `workspace`.`healthcare_claims`.`claim_lines`  
**Column Count:** 31

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `claim_line_id` | `STRING` | NO | 1 | Unique identifier for the claim line (UUID) |
| `claim_id` | `STRING` | NO | 2 | Foreign key referencing claims.claim_id |
| `line_number` | `INT` | NO | 3 | Sequential line item number within the claim (1-based) |
| `procedure_code` | `STRING` | YES | 4 | CPT/HCPCS procedure code billed on this line |
| `procedure_desc` | `STRING` | YES | 5 | Description of the billed procedure |
| `modifier_1` | `STRING` | YES | 6 | First CPT modifier code (e.g. 25, 59, RT, LT) |
| `modifier_2` | `STRING` | YES | 7 | Second CPT modifier code |
| `modifier_3` | `STRING` | YES | 8 | Third CPT modifier code |
| `modifier_4` | `STRING` | YES | 9 | Fourth CPT modifier code |
| `primary_diagnosis_code` | `STRING` | NO | 10 | Primary ICD-10-CM diagnosis code for this line |
| `diagnosis_code_2` | `STRING` | YES | 11 | Secondary diagnosis code |
| `diagnosis_code_3` | `STRING` | YES | 12 | Tertiary diagnosis code |
| `diagnosis_code_4` | `STRING` | YES | 13 | Quaternary diagnosis code |
| `revenue_code` | `STRING` | YES | 14 | UB-04 revenue code (facility claims) |
| `service_from_date` | `DATE` | NO | 15 | Service start date for this line |
| `service_to_date` | `DATE` | NO | 16 | Service end date for this line |
| `units_of_service` | `DOUBLE` | NO | 17 | Number of units (days, visits, items) billed |
| `unit_type` | `STRING` | YES | 18 | Unit qualifier: DA=Days, UN=Units, VS=Visits |
| `billed_amount` | `DOUBLE` | NO | 19 | Amount billed on this line (USD) |
| `allowed_amount` | `DOUBLE` | YES | 20 | Allowed amount after network contract |
| `paid_amount` | `DOUBLE` | YES | 21 | Amount paid to the provider for this line |
| `member_liability` | `DOUBLE` | YES | 22 | Member cost-sharing for this line |
| `line_status` | `STRING` | NO | 23 | Line adjudication status: PAID, DENIED, PENDING, VOID |
| `denial_reason_code` | `STRING` | YES | 24 | ANSI X12 claim adjustment reason code if denied |
| `denial_reason_desc` | `STRING` | YES | 25 | Human-readable denial reason description |
| `rendering_npi` | `STRING` | YES | 26 | Rendering provider NPI (may differ from header NPI) |
| `referring_npi` | `STRING` | YES | 27 | Referring provider NPI |
| `ordering_npi` | `STRING` | YES | 28 | Ordering provider NPI (labs, DME) |
| `service_facility_npi` | `STRING` | YES | 29 | Service facility NPI |
| `created_at` | `TIMESTAMP` | NO | 30 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 31 | Record last-update timestamp (UTC) |

---

## eligibility

**Description:** Member insurance eligibility and benefit coverage records by coverage period.  
**Full Name:** `workspace`.`healthcare_claims`.`eligibility`  
**Column Count:** 34

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `eligibility_id` | `STRING` | NO | 1 | Unique eligibility record identifier (UUID) |
| `member_id` | `STRING` | NO | 2 | Foreign key referencing members.member_id |
| `subscriber_id` | `STRING` | NO | 3 | Subscriber / policy holder identifier |
| `group_number` | `STRING` | YES | 4 | Employer group number |
| `plan_id` | `STRING` | NO | 5 | Health plan identifier |
| `plan_name` | `STRING` | YES | 6 | Health plan marketing name |
| `plan_type` | `STRING` | YES | 7 | Plan product type: HMO, PPO, EPO, POS, HDHP, MAPD |
| `lob` | `STRING` | YES | 8 | Line of business: COMMERCIAL, MEDICARE, MEDICAID, EXCHANGE |
| `metal_level` | `STRING` | YES | 9 | ACA metal tier: BRONZE, SILVER, GOLD, PLATINUM, CATASTROPHIC |
| `coverage_type` | `STRING` | YES | 10 | Coverage type: MEDICAL, DENTAL, VISION, BEHAVIORAL, PHARMACY |
| `effective_date` | `DATE` | NO | 11 | Coverage start date |
| `termination_date` | `DATE` | YES | 12 | Coverage end date (NULL if currently active) |
| `is_active` | `BOOLEAN` | NO | 13 | TRUE if coverage is active on the current date |
| `relationship_code` | `STRING` | YES | 14 | Member relationship to subscriber: 18=Self, 01=Spouse |
| `individual_deductible_in` | `DOUBLE` | YES | 15 | Individual in-network deductible amount (USD) |
| `individual_deductible_out` | `DOUBLE` | YES | 16 | Individual out-of-network deductible amount (USD) |
| `family_deductible_in` | `DOUBLE` | YES | 17 | Family in-network deductible amount (USD) |
| `family_deductible_out` | `DOUBLE` | YES | 18 | Family out-of-network deductible amount (USD) |
| `individual_oop_in` | `DOUBLE` | YES | 19 | Individual in-network out-of-pocket maximum (USD) |
| `individual_oop_out` | `DOUBLE` | YES | 20 | Individual out-of-network out-of-pocket maximum (USD) |
| `family_oop_in` | `DOUBLE` | YES | 21 | Family in-network out-of-pocket maximum (USD) |
| `family_oop_out` | `DOUBLE` | YES | 22 | Family out-of-network out-of-pocket maximum (USD) |
| `primary_copay` | `DOUBLE` | YES | 23 | Primary care copay amount (USD) |
| `specialist_copay` | `DOUBLE` | YES | 24 | Specialist visit copay amount (USD) |
| `er_copay` | `DOUBLE` | YES | 25 | Emergency room copay amount (USD) |
| `coinsurance_in` | `DOUBLE` | YES | 26 | In-network coinsurance percentage (0.0 – 1.0) |
| `coinsurance_out` | `DOUBLE` | YES | 27 | Out-of-network coinsurance percentage (0.0 – 1.0) |
| `pcp_required` | `BOOLEAN` | YES | 28 | TRUE if PCP referral is required (HMO/POS) |
| `rx_benefit_included` | `BOOLEAN` | YES | 29 | TRUE if pharmacy benefit is included in this plan |
| `premium_amount` | `DOUBLE` | YES | 30 | Monthly premium amount paid by member (USD) |
| `employer_contribution` | `DOUBLE` | YES | 31 | Monthly employer contribution to premium (USD) |
| `data_source` | `STRING` | YES | 32 | Source of eligibility data: 834_EDI, MANUAL, API |
| `created_at` | `TIMESTAMP` | NO | 33 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 34 | Record last-update timestamp (UTC) |

---

## pharmacy_claims

**Description:** Pharmacy and prescription drug claims processed through the pharmacy benefit manager (PBM).  
**Full Name:** `workspace`.`healthcare_claims`.`pharmacy_claims`  
**Column Count:** 44

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `rx_claim_id` | `STRING` | NO | 1 | Unique pharmacy claim identifier (UUID) |
| `rx_number` | `STRING` | NO | 2 | Prescription number assigned by the pharmacy |
| `member_id` | `STRING` | NO | 3 | Foreign key referencing members.member_id |
| `prescriber_npi` | `STRING` | NO | 4 | NPI of the prescribing provider |
| `pharmacy_npi` | `STRING` | NO | 5 | NPI of the dispensing pharmacy |
| `pharmacy_name` | `STRING` | YES | 6 | Pharmacy business name |
| `pharmacy_nabp` | `STRING` | YES | 7 | NABP (NCPDP) pharmacy identifier number |
| `fill_date` | `DATE` | NO | 8 | Date the prescription was filled/dispensed |
| `written_date` | `DATE` | YES | 9 | Date the prescription was written by the provider |
| `ndc_code` | `STRING` | NO | 10 | National Drug Code (11-digit: labeler-product-package) |
| `drug_name` | `STRING` | NO | 11 | Brand or generic drug name |
| `generic_name` | `STRING` | YES | 12 | Generic (INN) drug name |
| `brand_name` | `STRING` | YES | 13 | Brand drug name |
| `drug_strength` | `STRING` | YES | 14 | Drug strength and unit (e.g. 10MG, 500MG/5ML) |
| `dosage_form` | `STRING` | YES | 15 | Dosage form: TABLET, CAPSULE, LIQUID, INJECTION, PATCH |
| `route_of_admin` | `STRING` | YES | 16 | Route of administration: ORAL, TOPICAL, IV, IM, SC |
| `quantity_dispensed` | `DOUBLE` | NO | 17 | Number of units dispensed |
| `days_supply` | `INT` | NO | 18 | Days supply dispensed (e.g. 30, 90) |
| `refill_number` | `INT` | YES | 19 | Refill sequence number (0 = original fill) |
| `refills_authorized` | `INT` | YES | 20 | Total refills authorized on prescription |
| `is_generic` | `BOOLEAN` | YES | 21 | TRUE if generic drug was dispensed |
| `is_brand` | `BOOLEAN` | YES | 22 | TRUE if brand name drug was dispensed |
| `is_specialty` | `BOOLEAN` | YES | 23 | TRUE if classified as a specialty drug |
| `is_mail_order` | `BOOLEAN` | YES | 24 | TRUE if dispensed via mail order pharmacy |
| `formulary_tier` | `INT` | YES | 25 | Formulary tier level (1=preferred generic to 5=specialty) |
| `formulary_status` | `STRING` | YES | 26 | Formulary status: PREFERRED, NON_PREFERRED, NON_FORMULARY |
| `therapeutic_class` | `STRING` | YES | 27 | GPI therapeutic drug class description |
| `gpi_code` | `STRING` | YES | 28 | Medi-Span Generic Product Identifier (14-digit GPI) |
| `claim_status` | `STRING` | NO | 29 | Claim status: PAID, REJECTED, REVERSED, PENDING |
| `reject_code` | `STRING` | YES | 30 | NCPDP rejection code if claim was rejected |
| `billed_amount` | `DOUBLE` | NO | 31 | Amount billed by the pharmacy (AWP-based) |
| `allowed_amount` | `DOUBLE` | YES | 32 | Contractually allowed amount after MAC/AWP discount |
| `plan_paid_amount` | `DOUBLE` | YES | 33 | Amount paid by the health plan |
| `member_copay` | `DOUBLE` | YES | 34 | Copay amount paid by the member |
| `member_coinsurance` | `DOUBLE` | YES | 35 | Coinsurance amount paid by the member |
| `deductible_applied` | `DOUBLE` | YES | 36 | Amount applied toward the drug deductible |
| `ingredient_cost` | `DOUBLE` | YES | 37 | Ingredient (drug acquisition) cost |
| `dispensing_fee` | `DOUBLE` | YES | 38 | Pharmacy dispensing fee |
| `tax_amount` | `DOUBLE` | YES | 39 | Sales tax on the prescription |
| `diagnosis_code` | `STRING` | YES | 40 | Associated ICD-10-CM diagnosis code |
| `daw_code` | `STRING` | YES | 41 | Dispense As Written code (0-9): DAW-0=no instruction |
| `prior_auth_number` | `STRING` | YES | 42 | Prior authorization approval number if required |
| `created_at` | `TIMESTAMP` | NO | 43 | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | NO | 44 | Record last-update timestamp (UTC) |

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Catalog | `workspace` |
| Schema | `healthcare_claims` |
| Total Tables | 8 |
| Total Columns | 244 |
| Avg Columns / Table | 30.5 |
| Documentation Generated | 2026-03-09 05:15:27 UTC |

---
*This documentation was auto-generated by the DataEngineer agent.*