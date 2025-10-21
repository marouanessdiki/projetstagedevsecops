-- Fix JRXML column size to accommodate large templates
-- Run this script in your MySQL database

USE gestion_salaries;

-- Check current column definition
DESCRIBE attestation_templates;

-- Alter the jrxml column to LONGTEXT to handle large JRXML content
ALTER TABLE attestation_templates 
MODIFY COLUMN jrxml LONGTEXT NOT NULL;

-- Verify the change
DESCRIBE attestation_templates;
