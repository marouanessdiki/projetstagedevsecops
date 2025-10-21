package com.netcon.gestion_salaries.repository;

import com.netcon.gestion_salaries.entity.AttestationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttestationTemplateRepository extends JpaRepository<AttestationTemplate, Long> {
    
    Optional<AttestationTemplate> findByNameIgnoreCase(String name);
    
    boolean existsByNameIgnoreCase(String name);
}
