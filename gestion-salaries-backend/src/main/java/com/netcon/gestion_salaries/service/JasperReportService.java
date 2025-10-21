package com.netcon.gestion_salaries.service;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class JasperReportService {

    /**
     * Compiles a Jasper Report template from the classpath
     * @param templatePath Path to the .jrxml template file
     * @return Compiled JasperReport
     * @throws JRException if compilation fails
     */
    public JasperReport compileReport(String templatePath) throws JRException {
        try {
            ClassPathResource resource = new ClassPathResource(templatePath);
            InputStream inputStream = resource.getInputStream();
            return JasperCompileManager.compileReport(inputStream);
        } catch (Exception e) {
            log.error("Error compiling Jasper Report template: {}", templatePath, e);
            throw new JRException("Failed to compile report template: " + templatePath, e);
        }
    }

    /**
     * Fills a Jasper Report with data
     * @param report Compiled JasperReport
     * @param parameters Report parameters
     * @param dataList List of data objects for the report
     * @return Filled JasperPrint object
     * @throws JRException if filling fails
     */
    public JasperPrint fillReport(JasperReport report, Map<String, Object> parameters, List<?> dataList) throws JRException {
        try {
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);
            return JasperFillManager.fillReport(report, parameters, dataSource);
        } catch (Exception e) {
            log.error("Error filling Jasper Report", e);
            throw new JRException("Failed to fill report", e);
        }
    }

    /**
     * Exports a Jasper Report to PDF file
     * @param jasperPrint Filled JasperPrint object
     * @param outputPath Path where the PDF should be saved
     * @throws JRException if export fails
     */
    public void exportToPdf(JasperPrint jasperPrint, String outputPath) throws JRException {
        try {
            JasperExportManager.exportReportToPdfFile(jasperPrint, outputPath);
            log.info("PDF exported successfully to: {}", outputPath);
        } catch (Exception e) {
            log.error("Error exporting PDF to: {}", outputPath, e);
            throw new JRException("Failed to export PDF to: " + outputPath, e);
        }
    }

    /**
     * Exports a Jasper Report to PDF as byte array
     * @param jasperPrint Filled JasperPrint object
     * @return PDF content as byte array
     * @throws JRException if export fails
     */
    public byte[] exportToPdfBytes(JasperPrint jasperPrint) throws JRException {
        try {
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            log.error("Error exporting PDF to bytes", e);
            throw new JRException("Failed to export PDF to bytes", e);
        }
    }
}
