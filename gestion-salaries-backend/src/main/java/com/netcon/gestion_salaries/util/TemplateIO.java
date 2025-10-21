package com.netcon.gestion_salaries.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
public class TemplateIO {
    
    @Value("${attestations.reportDir:src/main/resources/reports/attestations}")
    private String reportDir;
    
    public void writeToDisk(String name, String jrxml) {
        try {
            Path baseDir = Paths.get(reportDir);
            Files.createDirectories(baseDir);
            
            Path filePath = baseDir.resolve(name.toUpperCase(Locale.ROOT) + ".jrxml");
            Files.writeString(filePath, jrxml, StandardCharsets.UTF_8, 
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            
            log.info("Template written to disk: {} -> {}", name, filePath);
        } catch (IOException e) {
            log.error("Failed to write template {} to disk: {}", name, e.getMessage(), e);
            throw new RuntimeException("Failed to write template to disk", e);
        }
    }
    
    public String readFromDisk(String name) {
        try {
            Path filePath = Paths.get(reportDir).resolve(name.toUpperCase(Locale.ROOT) + ".jrxml");
            if (Files.exists(filePath)) {
                return Files.readString(filePath, StandardCharsets.UTF_8);
            }
            return null;
        } catch (IOException e) {
            log.warn("Failed to read template {} from disk: {}", name, e.getMessage());
            return null;
        }
    }
    
    public String readFromClasspath(String relativePath) {
        try {
            ClassPathResource resource = new ClassPathResource(relativePath);
            if (resource.exists()) {
                try (var inputStream = resource.getInputStream()) {
                    return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                }
            }
            return null;
        } catch (IOException e) {
            log.warn("Failed to read template {} from classpath: {}", relativePath, e.getMessage());
            return null;
        }
    }
    
    public void deleteFromDisk(String name) {
        try {
            Path filePath = Paths.get(reportDir).resolve(name.toUpperCase(Locale.ROOT) + ".jrxml");
            Files.deleteIfExists(filePath);
            log.info("Template file deleted: {} -> {}", name, filePath);
        } catch (IOException e) {
            log.warn("Failed to delete template file {}: {}", name, e.getMessage());
        }
    }
    
    public boolean isValidPath(String name) {
        // Prevent path traversal attacks
        return name != null && 
               !name.contains("..") && 
               !name.contains("/") && 
               !name.contains("\\") &&
               name.matches("^[A-Z_]{2,40}$");
    }
}
