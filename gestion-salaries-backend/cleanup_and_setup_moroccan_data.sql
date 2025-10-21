-- Clean up existing data and insert new Moroccan employees
-- Run this script to reset the database with Moroccan employee data

-- Delete all existing attestations first (due to foreign key constraints)
DELETE FROM attestation;

-- Delete all existing employees
DELETE FROM employe;

-- Reset auto-increment counters
ALTER TABLE employe AUTO_INCREMENT = 1;
ALTER TABLE attestation AUTO_INCREMENT = 1;

-- Insert new employees with authentic Moroccan names
INSERT INTO employe (nom, prenom, cin, poste, service, date_embauche, salaire, sexe, cnss_numero) VALUES
-- Management Team
('Alaoui', 'Mohamed', 'MA123456', 'Directeur Général', 'Direction', '2022-01-15', '25000', 'M', 'CNSS001'),
('Benali', 'Fatima', 'MA234567', 'Directrice RH', 'Ressources Humaines', '2022-03-10', '18000', 'F', 'CNSS002'),
('Chraibi', 'Hassan', 'MA345678', 'Directeur Financier', 'Finance', '2022-02-20', '20000', 'M', 'CNSS003'),

-- IT Department
('Idrissi', 'Amina', 'MA456789', 'Chef de Projet IT', 'Informatique', '2022-06-01', '15000', 'F', 'CNSS004'),
('Tazi', 'Youssef', 'MA567890', 'Développeur Senior', 'Informatique', '2022-07-15', '12000', 'M', 'CNSS005'),
('El Fassi', 'Karima', 'MA678901', 'Développeuse Full Stack', 'Informatique', '2023-01-10', '11000', 'F', 'CNSS006'),
('Bennani', 'Omar', 'MA789012', 'Développeur Backend', 'Informatique', '2023-03-20', '10000', 'M', 'CNSS007'),
('Rahmani', 'Zineb', 'MA890123', 'Développeuse Frontend', 'Informatique', '2023-05-15', '9500', 'F', 'CNSS008'),

-- HR Department
('Cherkaoui', 'Laila', 'MA901234', 'Responsable RH', 'Ressources Humaines', '2022-08-01', '13000', 'F', 'CNSS009'),
('Berrada', 'Ahmed', 'MA012345', 'Assistant RH', 'Ressources Humaines', '2023-02-15', '8000', 'M', 'CNSS010'),

-- Finance Department
('Hassani', 'Nadia', 'MA111111', 'Comptable Senior', 'Finance', '2022-09-01', '12000', 'F', 'CNSS011'),
('Mansouri', 'Khalid', 'MA222222', 'Contrôleur de Gestion', 'Finance', '2023-01-20', '14000', 'M', 'CNSS012'),

-- Marketing & Sales
('Zerouali', 'Sara', 'MA333333', 'Responsable Marketing', 'Marketing', '2022-10-15', '13000', 'F', 'CNSS013'),
('Ouazzani', 'Rachid', 'MA444444', 'Commercial Senior', 'Ventes', '2023-04-01', '11000', 'M', 'CNSS014'),
('Lahlou', 'Imane', 'MA555555', 'Chargée de Communication', 'Marketing', '2023-06-10', '9000', 'F', 'CNSS015'),

-- Operations & Quality
('Boukhari', 'Younes', 'MA666666', 'Chef de Production', 'Production', '2022-11-01', '14000', 'M', 'CNSS016'),
('El Mansouri', 'Khadija', 'MA777777', 'Responsable Qualité', 'Qualité', '2023-03-01', '12500', 'F', 'CNSS017'),
('Touil', 'Adil', 'MA888888', 'Technicien Maintenance', 'Maintenance', '2023-07-01', '8500', 'M', 'CNSS018'),

-- Support Staff
('Bouzidi', 'Hanane', 'MA999999', 'Secrétaire Générale', 'Administration', '2022-12-01', '7000', 'F', 'CNSS019'),
('Dahmani', 'Mehdi', 'MA000000', 'Agent de Sécurité', 'Sécurité', '2023-08-15', '6000', 'M', 'CNSS020');

-- Insert some sample attestations for testing
INSERT INTO attestation (employe_id, type_attestation, date_generation, chemin_fichier) VALUES
(1, 'Attestation Salaire', NOW(), '/pdfs/Alaoui-Mohamed_AttestationSalaire_2024-01-15.pdf'),
(2, 'Attestation Travail', NOW(), '/pdfs/Benali-Fatima_AttestationTravail_2024-01-15.pdf'),
(3, 'Attestation Titularisation', NOW(), '/pdfs/Chraibi-Hassan_AttestationTitularisation_2024-01-15.pdf');

-- Display summary
SELECT 
    'Employees inserted: ' as Summary,
    COUNT(*) as Count
FROM employe
UNION ALL
SELECT 
    'Attestations created: ' as Summary,
    COUNT(*) as Count
FROM attestation;
