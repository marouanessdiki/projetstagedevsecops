-- Manual fix for JRXML column size
-- Run this directly in MySQL Workbench or command line

USE gestion_salaries;

-- First, check the current column definition
DESCRIBE attestation_templates;

-- Alter the jrxml column to LONGTEXT
ALTER TABLE attestation_templates 
MODIFY COLUMN jrxml LONGTEXT NOT NULL;

-- Verify the change
DESCRIBE attestation_templates;

-- Optional: If you want to see the current data
SELECT id, name, LENGTH(jrxml) as jrxml_length FROM attestation_templates;
