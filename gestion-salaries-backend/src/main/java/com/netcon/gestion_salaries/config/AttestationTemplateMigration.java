package com.netcon.gestion_salaries.config;

import com.netcon.gestion_salaries.service.AttestationTemplateMigrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AttestationTemplateMigration {
    
    private final AttestationTemplateMigrationService migrationService;
    
    @Bean
    public ApplicationRunner migrateAttestationTemplates() {
        return args -> {
            log.info("Starting attestation template migration on application startup...");
            migrationService.migrateTemplates();
        };
    }
}
