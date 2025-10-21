-- Clean database script - removes all employees and attestations
-- Run this if you want to start fresh

-- Delete all attestations first (due to foreign key constraints)
DELETE FROM attestation;

-- Delete all employees
DELETE FROM employe;

-- Reset auto-increment counters
ALTER TABLE employe AUTO_INCREMENT = 1;
ALTER TABLE attestation AUTO_INCREMENT = 1;

-- Verify cleanup
SELECT 'Employees remaining:' as Status, COUNT(*) as Count FROM employe
UNION ALL
SELECT 'Attestations remaining:' as Status, COUNT(*) as Count FROM attestation;
