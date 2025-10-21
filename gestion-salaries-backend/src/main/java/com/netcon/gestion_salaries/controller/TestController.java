package com.netcon.gestion_salaries.controller;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/test")
@Slf4j
public class TestController {

    @GetMapping("/jasper")
    public ResponseEntity<String> testJasper() {
        try {
            log.info("Testing Jasper Reports...");
            
            // Create a simple test PDF
            String dir = "pdfs/";
            new File(dir).mkdirs();
            String fileName = dir + "test_" + System.currentTimeMillis() + ".pdf";
            
            // Create a simple report
            JasperReport jasperReport = JasperCompileManager.compileReport(
                new ClassPathResource("reports/attestation_template.jrxml").getInputStream()
            );
            
            // Prepare parameters
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("typeAttestation", "TRAVAIL");
            parameters.put("reference", "TEST-001");
            parameters.put("currentDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            
            // Prepare data
            Map<String, Object> data = new HashMap<>();
            data.put("nom", "Test");
            data.put("prenom", "User");
            data.put("cin", "123456");
            data.put("poste", "Testeur");
            data.put("service", "Test");
            data.put("dateEmbauche", "01/01/2024");
            
            List<Map<String, Object>> dataList = Arrays.asList(data);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);
            
            // Fill and export
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            JasperExportManager.exportReportToPdfFile(jasperPrint, fileName);
            
            log.info("Test PDF generated successfully: {}", fileName);
            return ResponseEntity.ok("Jasper Reports test successful! File: " + fileName);
            
        } catch (Exception e) {
            log.error("Jasper Reports test failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body("Jasper Reports test failed: " + e.getMessage());
        }
    }
}
