package com.netcon.gestion_salaries.service;

import com.netcon.gestion_salaries.dao.inteface.IAttestationDao;
import com.netcon.gestion_salaries.dao.inteface.IEmployeDao;
import com.netcon.gestion_salaries.entity.AttestationTemplate;
import com.netcon.gestion_salaries.records.AttestationDto;
import com.netcon.gestion_salaries.records.EmployeDto;
import com.netcon.gestion_salaries.service.inteface.IAttestationService;
import com.netcon.gestion_salaries.service.inteface.IAttestationTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttestationServiceImpl implements IAttestationService {

    private final IAttestationDao attestationDao;
    private final IEmployeDao employeDao;
    private final DataSource dataSource;
    private final IAttestationTemplateService attestationTemplateService;

    @Override
    public List<AttestationDto> findByEmploye(Long employeId) {
        return attestationDao.findByEmployeId(employeId);
    }

    @Override
    public AttestationDto save(AttestationDto attestation) {
        attestation.setDateGeneration(LocalDateTime.now());
        return attestationDao.save(attestation);
    }

    @Override
    public List<AttestationDto> findAll() {
        return attestationDao.findAll();
    }

    @Override
    public AttestationDto findById(Long id) {
        return attestationDao.findById(id);
    }

    @Override
    @Transactional
    public AttestationDto generateAndSave(AttestationDto attestation) throws Exception {
        EmployeDto employe = employeDao.findById(attestation.getEmployeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + attestation.getEmployeId()));
        log.info("Found employee: {} {}", employe.getNom(), employe.getPrenom());

        // Save attestation to get ID, but roll back if PDF fails
        AttestationDto saved = save(attestation);
        log.info("Saved attestation with ID: {}", saved.getId());

        try {
            // Ensure pdfs/ directory exists
            String dir = "pdfs/";
            java.nio.file.Files.createDirectories(java.nio.file.Paths.get(dir));

            // Generate the professional PDF
            String filePath = generateProfessionalPdf(saved, employe, attestation.getTypeAttestation());
            log.info("Generated PDF at path: {}", filePath);

            // Persist the file path
            attestationDao.updateCheminFichier(saved.getId(), filePath);
            log.info("Updated file path in database");

            // Return DTO with updated path
            saved.setCheminFichier(filePath);
            return saved;
        } catch (Exception e) {
            log.error("Error in generateAndSave: {}", e.getMessage(), e);
            // Roll back attestation if PDF generation fails
            attestationDao.deleteById(saved.getId());
            throw new Exception("Attestation generation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteById(Long id) {
        attestationDao.deleteById(id);
    }

    @Override
    public byte[] generateAttestation(String typeName, Long employeId, Map<String, Object> params) {
        log.info("Generating attestation: type={}, employeId={}", typeName, employeId);

        try {
            AttestationTemplate template = attestationTemplateService.findByName(typeName);

            // Add employee ID to parameters if not present (before JRXML compilation)
            if (!params.containsKey("employeId")) {
                params.put("employeId", employeId);
            }

            try (ByteArrayInputStream inputStream = new ByteArrayInputStream(
                    template.getJrxml().getBytes(StandardCharsets.UTF_8))) {

                JasperReport report = JasperCompileManager.compileReport(inputStream);
                log.debug("Template compiled successfully: {}", typeName);

                // Get database connection for SQL-based templates
                try (java.sql.Connection connection = dataSource.getConnection()) {
                    JasperPrint jasperPrint = JasperFillManager.fillReport(report, params, connection);
                    byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

                    log.info("Attestation generated successfully: type={}, size={} bytes", typeName, pdfBytes.length);
                    return pdfBytes;
                }
            }
        } catch (RuntimeException e) {
            log.error("Template {} not found in database: {}", typeName, e.getMessage());
            throw e;
        } catch (JRException e) {
            log.error("JRXML compile/fill failed for template {}: {}", typeName, e.getMessage(), e);
            throw new com.netcon.gestion_salaries.exception.UnprocessableEntityException(
                    "JRXML compile/fill failed: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error generating attestation for template {}: {}", typeName, e.getMessage(), e);
            throw new RuntimeException("Error generating attestation: " + e.getMessage(), e);
        }
    }

    private byte[] generateAttestationFromLegacyFile(String typeName, Long employeId, Map<String, Object> params) {
        log.info("Using legacy file system for template: {}", typeName);

        // Map new template names to legacy file paths
        String legacyFilePath = mapTemplateNameToLegacyFile(typeName);

        try (var inputStream = new ClassPathResource(legacyFilePath).getInputStream()) {
            JasperReport report = JasperCompileManager.compileReport(inputStream);
            log.debug("Legacy template compiled successfully: {}", legacyFilePath);

            try (java.sql.Connection connection = dataSource.getConnection()) {
                if (!params.containsKey("employeId")) {
                    params.put("employeId", employeId);
                }

                JasperPrint jasperPrint = JasperFillManager.fillReport(report, params, connection);
                byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

                log.info("Legacy attestation generated successfully: type={}, size={} bytes", typeName,
                        pdfBytes.length);
                return pdfBytes;
            }
        } catch (Exception e) {
            log.error("Failed to generate attestation from legacy file {}: {}", legacyFilePath, e.getMessage(), e);
            throw new RuntimeException("Failed to generate attestation from legacy file: " + e.getMessage(), e);
        }
    }

    private String mapTemplateNameToLegacyFile(String typeName) {
        return switch (typeName) {
            case "SALAIRE" -> "reports/attestation_salaire.jrxml";
            case "TRAVAIL" -> "reports/attestation_travail.jrxml";
            case "TITULARISATION" -> "reports/attestation_titularisation.jrxml";
            case "AVENANT_AUGMENTATION_SALAIRE" -> "reports/avenant_augmentation_salaire.jrxml";
            case "ENGAGEMENT_VERSEMENT_SALAIRE" -> "reports/engagement_versement_salaire.jrxml";
            default -> "reports/attestation_template.jrxml";
        };
    }

    private String generateProfessionalPdf(AttestationDto attestation, EmployeDto employe, String type)
            throws IOException, JRException {
        String dir = "pdfs/";
        java.nio.file.Files.createDirectories(java.nio.file.Paths.get(dir));

        // Create filename: name-of-employee_type-of-attestation_date.pdf
        String employeeName = employe.getNom().replaceAll("[^a-zA-Z0-9]", "") + "-"
                + employe.getPrenom().replaceAll("[^a-zA-Z0-9]", "");
        String attestationType = type.replaceAll("[^a-zA-Z0-9]", "").replaceAll("\\s+", "-");
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String fileName = dir + employeeName + "_" + attestationType + "_" + dateStr + ".pdf";

        log.info("Starting PDF generation for attestation ID: {}", attestation.getId());

        try {
            // Disable ALL JasperReports validations
            System.setProperty("net.sf.jasperreports.xml.validation", "false");
            System.setProperty("net.sf.jasperreports.compiler.xml.validation", "false");

            // Use new dynamic template loading - no more hardcoded switches
            log.info("Loading Jasper template for type: {}", type);

            // Use the type directly as template name (sent from frontend)
            String templateName = type;

            // Use the new generateAttestation method for consistency
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("typeAttestation", type);
            parameters.put("reference", "ATT-" + attestation.getId() + "-"
                    + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
            parameters.put("currentDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            parameters.put("ReportDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            parameters.put("employeId", employe.getId());

            // Generate PDF using new method
            byte[] pdfBytes = generateAttestation(templateName, employe.getId(), parameters);

            // Write to file
            try (java.io.FileOutputStream fos = new java.io.FileOutputStream(fileName)) {
                fos.write(pdfBytes);
                log.info("PDF written successfully: {}", fileName);
                return fileName;
            } catch (IOException e) {
                log.error("Failed to write PDF file: {}", e.getMessage(), e);
                throw new JRException("Failed to write PDF file: " + e.getMessage(), e);
            }

        } catch (Exception e) {
            log.error("Error generating PDF: {}", e.getMessage(), e);
            throw new JRException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }

    private String mapLegacyTypeToTemplateName(String legacyType) {
        return switch (legacyType) {
            case "Attestation Salaire" -> "SALAIRE";
            case "Attestation Travail" -> "TRAVAIL";
            case "Attestation Titularisation" -> "TITULARISATION";
            case "Avenant Augmentation Salaire" -> "AVENANT_AUGMENTATION_SALAIRE";
            case "Engagement Versement Salaire" -> "ENGAGEMENT_VERSEMENT_SALAIRE";
            default -> "TRAVAIL"; // Default fallback
        };
    }
}
