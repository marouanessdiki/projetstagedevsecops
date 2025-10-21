-- Insert test employee data into existing employe table
INSERT INTO employe (nom, prenom, cin, poste, service, date_embauche) VALUES
('Dupont', 'Jean', 'AB123456', 'Développeur', 'Informatique', '2023-01-15'),
('Martin', 'Marie', 'CD789012', 'Analyste', 'Ressources Humaines', '2023-03-20'),
('Bernard', 'Pierre', 'EF345678', 'Manager', 'Finance', '2022-11-10'),
('Petit', 'Sophie', 'GH901234', 'Designer', 'Marketing', '2023-06-05'),
('Moreau', 'Lucas', 'IJ567890', 'Testeur', 'Qualité', '2023-08-12');

-- Insert test attestation data
INSERT INTO attestation (employe_id, type_attestation, date_generation, chemin_fichier) VALUES
(1, 'SALAIRE', NOW(), '/attestations/dupont_jean_salaire.pdf'),
(2, 'TRAVAIL', NOW(), '/attestations/martin_marie_travail.pdf'),
(3, 'SALAIRE', NOW(), '/attestations/bernard_pierre_salaire.pdf'); 