package com.netcon.gestion_salaries.service;

import com.netcon.gestion_salaries.entity.AttestationTemplate;
import com.netcon.gestion_salaries.repository.AttestationTemplateRepository;
import com.netcon.gestion_salaries.util.TemplateIO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttestationTemplateMigrationService {

    private final AttestationTemplateRepository repository;
    private final TemplateIO templateIO;

    public void migrateTemplates() {
        log.info("Starting attestation template migration...");

        Map<String, String> legacyToNew = Map.of(
                "SALAIRE.jrxml", "SALAIRE",
                "TRAVAIL.jrxml", "TRAVAIL",
                "TITULARISATION.jrxml", "TITULARISATION",
                "AUGMENTATTION_SALAIRE.jrxml", "AVENANT_AUGMENTATION_SALAIRE",
                "ENGAGEMENT_VERSEMENT_SALAIRE.jrxml", "ENGAGEMENT_VERSEMENT_SALAIRE");

        int migratedCount = 0;
        int skippedCount = 0;
        int errorCount = 0;

        for (Map.Entry<String, String> entry : legacyToNew.entrySet()) {
            String legacyFileName = entry.getKey();
            String newName = entry.getValue();

            try {
                // Check if template already exists in database
                if (repository.existsByNameIgnoreCase(newName)) {
                    log.debug("Template {} already exists in database, skipping migration", newName);
                    skippedCount++;
                    continue;
                }

                // Try to load legacy file using TemplateIO
                String jrxmlContent = templateIO.readFromClasspath("reports/attestations/" + legacyFileName);
                if (jrxmlContent == null) {
                    log.warn("Legacy file {} not found, skipping", legacyFileName);
                    skippedCount++;
                    continue;
                }

                // Create new template in database
                AttestationTemplate template = new AttestationTemplate();
                template.setName(newName);
                template.setJrxml(jrxmlContent);
                template.setUpdatedAt(LocalDateTime.now());

                repository.save(template);

                // Write new file format using TemplateIO
                templateIO.writeToDisk(newName, jrxmlContent);

                log.info("Migrated template: {} -> {}", legacyFileName, newName);
                migratedCount++;

            } catch (Exception e) {
                log.error("Failed to migrate template {}: {}", legacyFileName, e.getMessage());
                errorCount++;
            }
        }

        log.info("Attestation template migration completed - Migrated: {}, Skipped: {}, Errors: {}",
                migratedCount, skippedCount, errorCount);
    }

    public boolean isTemplateExists(String templateName) {
        return repository.existsByNameIgnoreCase(templateName);
    }

    public long getTemplateCount() {
        return repository.count();
    }
}
