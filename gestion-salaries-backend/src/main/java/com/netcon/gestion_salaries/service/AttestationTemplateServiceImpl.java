package com.netcon.gestion_salaries.service;

import com.netcon.gestion_salaries.entity.AttestationTemplate;
import com.netcon.gestion_salaries.records.AttestationTypeRequest;
import com.netcon.gestion_salaries.records.AttestationTypeResponse;
import com.netcon.gestion_salaries.repository.AttestationTemplateRepository;
import com.netcon.gestion_salaries.service.inteface.IAttestationTemplateService;
import com.netcon.gestion_salaries.util.TemplateIO;
import com.netcon.gestion_salaries.util.TemplateValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttestationTemplateServiceImpl implements IAttestationTemplateService {
    
    private final AttestationTemplateRepository repository;
    private final TemplateIO templateIO;
    private final TemplateValidator validator;
    
    @Override
    public List<AttestationTypeResponse> getAllTypes() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional
    public AttestationTypeResponse createOrUpdate(AttestationTypeRequest request) {
        // Validate the request
        validator.validateRequest(request.name(), request.jrxml());
        
        String upperName = request.name().toUpperCase(Locale.ROOT);
        log.info("Creating/updating attestation template: {}", upperName);
        
        Optional<AttestationTemplate> existing = repository.findByNameIgnoreCase(upperName);
        AttestationTemplate template;
        
        if (existing.isPresent()) {
            template = existing.get();
            template.setJrxml(request.jrxml());
            template.setUpdatedAt(LocalDateTime.now());
            log.info("Updated existing template: {}", upperName);
        } else {
            template = new AttestationTemplate();
            template.setName(upperName);
            template.setJrxml(request.jrxml());
            template.setUpdatedAt(LocalDateTime.now());
            log.info("Created new template: {}", upperName);
        }
        
        template = repository.save(template);
        
        // Write to file system using helper
        templateIO.writeToDisk(template.getName(), template.getJrxml());
        
        return mapToResponse(template);
    }
    
    @Override
    @Transactional
    public AttestationTypeResponse update(Long id, AttestationTypeRequest request) {
        AttestationTemplate template = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + id));
        
        String oldName = template.getName();
        String newName = request.name().toUpperCase(Locale.ROOT);
        
        log.info("Updating template ID {}: {} -> {}", id, oldName, newName);
        
        template.setName(newName);
        template.setJrxml(request.jrxml());
        template.setUpdatedAt(LocalDateTime.now());
        
        template = repository.save(template);
        
        // Handle file renaming if name changed
        if (!oldName.equals(newName)) {
            templateIO.deleteFromDisk(oldName);
            log.info("Renamed template file: {} -> {}", oldName, newName);
        }
        templateIO.writeToDisk(template.getName(), template.getJrxml());
        
        return mapToResponse(template);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        AttestationTemplate template = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + id));
        
        log.info("Deleting template: {} (ID: {})", template.getName(), id);
        
        templateIO.deleteFromDisk(template.getName());
        repository.deleteById(id);
    }
    
    @Override
    public AttestationTemplate findByName(String name) {
        return repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Unknown attestation type: " + name));
    }
    
    private AttestationTypeResponse mapToResponse(AttestationTemplate template) {
        String value = template.getName().toUpperCase(Locale.ROOT);
        String label = "Attestation " + value.charAt(0) + value.substring(1).toLowerCase(Locale.ROOT);
        return new AttestationTypeResponse(template.getId(), "ATTESTATION", value, label, template.getJrxml());
    }
}
