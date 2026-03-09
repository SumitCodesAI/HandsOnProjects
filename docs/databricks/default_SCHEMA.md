# Schema Documentation: `workspace`.`default`

> **Catalog:** `workspace`  
> **Schema:** `default`  
> **Generated:** 2026-03-09 05:29:44 UTC  
> **Tables:** 6  
> **Total Columns:** 40

---

## Table of Contents

1. [diamonds](#diamonds) — 10 columns
2. [people_10m](#people_10m) — 8 columns
3. [baby_names](#baby_names) — 5 columns
4. [flights](#flights) — 7 columns
5. [emp](#emp) — 6 columns
6. [department](#department) — 4 columns

---

## Summary

| # | Table Name | Columns | Description |
|---|-----------|---------|-------------|
| 1 | `diamonds` | 10 | Classic diamonds dataset with physical measurements and pricing attributes. |
| 2 | `people_10m` | 8 | Sample dataset of 10 million people with personal and financial attributes. |
| 3 | `baby_names` | 5 | US baby name popularity records by year, county, and sex. |
| 4 | `flights` | 7 | Domestic flight records including origin, destination, carrier, and delay information. |
| 5 | `emp` | 6 | Employee reference table with job roles, hire dates, and compensation details. |
| 6 | `department` | 4 | Department reference table with department codes, names, and manager assignments. |

---

## diamonds

**Description:** Classic diamonds dataset with physical measurements and pricing attributes.  
**Full Name:** `workspace`.`default`.`diamonds`  
**Column Count:** 10

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `carat` | `DOUBLE` | NO | 1 | Weight of the diamond in carats (0.2–5.01) |
| `cut` | `STRING` | NO | 2 | Quality of the cut: Fair, Good, Very Good, Premium, Ideal |
| `color` | `STRING` | NO | 3 | Diamond colour from D (best) to J (worst) |
| `clarity` | `STRING` | NO | 4 | Measurement of how clear the diamond is: I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF |
| `depth` | `DOUBLE` | YES | 5 | Total depth percentage = z / mean(x, y) = 2 * z / (x + y) (43–79) |
| `table` | `DOUBLE` | YES | 6 | Width of top of diamond relative to widest point (43–95) |
| `price` | `INT` | NO | 7 | Price in US dollars (326–18,823) |
| `x` | `DOUBLE` | YES | 8 | Length in mm (0–10.74) |
| `y` | `DOUBLE` | YES | 9 | Width in mm (0–58.9) |
| `z` | `DOUBLE` | YES | 10 | Depth in mm (0–31.8) |

---

## people_10m

**Description:** Sample dataset of 10 million people with personal and financial attributes.  
**Full Name:** `workspace`.`default`.`people_10m`  
**Column Count:** 8

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `id` | `INT` | NO | 1 | Unique person identifier |
| `firstName` | `STRING` | YES | 2 | Person's first name |
| `middleName` | `STRING` | YES | 3 | Person's middle name or initial |
| `lastName` | `STRING` | YES | 4 | Person's last name |
| `gender` | `STRING` | YES | 5 | Gender: M or F |
| `birthDate` | `TIMESTAMP` | YES | 6 | Date and time of birth |
| `ssn` | `STRING` | YES | 7 | Social Security Number (format: ddd-dd-dddd) |
| `salary` | `DOUBLE` | YES | 8 | Annual salary in US dollars |

---

## baby_names

**Description:** US baby name popularity records by year, county, and sex.  
**Full Name:** `workspace`.`default`.`baby_names`  
**Column Count:** 5

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `year` | `INT` | NO | 1 | Year the names were recorded |
| `first_name` | `STRING` | NO | 2 | Baby's first name |
| `county` | `STRING` | YES | 3 | County of registration |
| `sex` | `STRING` | NO | 4 | Sex of the baby: M (Male) or F (Female) |
| `count` | `INT` | NO | 5 | Number of babies given this name in this year/county/sex group |

---

## flights

**Description:** Domestic flight records including origin, destination, carrier, and delay information.  
**Full Name:** `workspace`.`default`.`flights`  
**Column Count:** 7

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `origin` | `STRING` | NO | 1 | IATA code of the departure airport |
| `dest` | `STRING` | NO | 2 | IATA code of the arrival airport |
| `distance` | `INT` | YES | 3 | Distance between airports in miles |
| `delay` | `INT` | YES | 4 | Arrival delay in minutes (negative = early) |
| `carrier_id` | `STRING` | YES | 5 | Carrier/airline identifier code |
| `flight_date` | `DATE` | NO | 6 | Scheduled flight date (YYYY-MM-DD) |
| `flight_num` | `STRING` | YES | 7 | Flight number assigned by the carrier |

---

## emp

**Description:** Employee reference table with job roles, hire dates, and compensation details.  
**Full Name:** `workspace`.`default`.`emp`  
**Column Count:** 6

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `empno` | `INT` | NO | 1 | Unique employee number (primary key) |
| `empname` | `STRING` | NO | 2 | Full name of the employee |
| `job` | `STRING` | YES | 3 | Job title or role (e.g. ANALYST, MANAGER, CLERK) |
| `hiredate` | `DATE` | YES | 4 | Date the employee was hired (YYYY-MM-DD) |
| `salary` | `DOUBLE` | YES | 5 | Monthly salary in US dollars |
| `deptno` | `INT` | YES | 6 | Foreign key referencing department.deptcode |

---

## department

**Description:** Department reference table with department codes, names, and manager assignments.  
**Full Name:** `workspace`.`default`.`department`  
**Column Count:** 4

| Column Name | Data Type | Nullable | Position | Comment |
|-------------|-----------|----------|----------|---------|
| `deptcode` | `INT` | NO | 1 | Unique department code (primary key) |
| `deptname` | `STRING` | NO | 2 | Full name of the department |
| `location` | `STRING` | YES | 3 | Physical location or city of the department |
| `mgrno` | `INT` | YES | 4 | Employee number of the department manager (references emp.empno) |

---
