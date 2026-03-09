ALTER TABLE workspace.healthcare_claims.Claims_Data ADD COLUMN CD_FLAG char(10);
UPDATE workspace.healthcare_claims.Claims_Data SET CD_FLAG = 'N' WHERE CD_FLAG IS NULL;
ALTER TABLE workspace.healthcare_claims.Class_Plans ADD COLUMN CP_FLAG char(10);
UPDATE workspace.healthcare_claims.Class_Plans SET CP_FLAG = 'N' WHERE CP_FLAG IS NULL;
ALTER TABLE workspace.healthcare_claims.Claims_Line_Data ADD COLUMN CL_FLAG char(10);
UPDATE workspace.healthcare_claims.Claims_Line_Data SET CL_FLAG = 'N' WHERE CL_FLAG IS NULL;
