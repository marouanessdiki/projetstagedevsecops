package com.netcon.gestion_salaries.controller;

import com.netcon.gestion_salaries.records.AttestationTypeRequest;
import com.netcon.gestion_salaries.records.AttestationTypeResponse;
import com.netcon.gestion_salaries.records.ParametreDto;
import com.netcon.gestion_salaries.service.AttestationTemplateMigrationService;
import com.netcon.gestion_salaries.service.inteface.IAttestationTemplateService;
import com.netcon.gestion_salaries.service.inteface.IParametreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parametres")
@RequiredArgsConstructor
public class ParametreController {

    private final IParametreService parametreService;
    private final IAttestationTemplateService attestationTemplateService;
    private final AttestationTemplateMigrationService migrationService;

    @GetMapping("/{type}")
    public ResponseEntity<List<ParametreDto>> getParametreWithType(@PathVariable String type) {
        return ResponseEntity.ok(parametreService.getParametreWithType(type));
    }
    
    // Attestation Template endpoints
    
    @GetMapping("/parametrage/attestations/types")
    public List<AttestationTypeResponse> list() {
        return attestationTemplateService.getAllTypes();
    }
    
    @PostMapping("/parametrage/attestations/types")
    public ResponseEntity<?> upsert(@RequestBody AttestationTypeRequest request) {
        try {
            // Manual validation to match project pattern
            if (request.name() == null || request.name().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (!request.name().matches("^[A-Z_]{2,40}$")) {
                return ResponseEntity.badRequest().body("Name must be 2–40 chars, uppercase letters/underscores only");
            }
            if (request.jrxml() == null || request.jrxml().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("JRXML content is required");
            }
            if (!request.jrxml().contains("<jasperReport")) {
                return ResponseEntity.badRequest().body("Invalid JRXML content - must contain <jasperReport>");
            }
            
            AttestationTypeResponse response = attestationTemplateService.createOrUpdate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/parametrage/attestations/types/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody AttestationTypeRequest request) {
        try {
            // Manual validation to match project pattern
            if (request.name() == null || request.name().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (!request.name().matches("^[A-Z_]{2,40}$")) {
                return ResponseEntity.badRequest().body("Name must be 2–40 chars, uppercase letters/underscores only");
            }
            if (request.jrxml() == null || request.jrxml().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("JRXML content is required");
            }
            if (!request.jrxml().contains("<jasperReport")) {
                return ResponseEntity.badRequest().body("Invalid JRXML content - must contain <jasperReport>");
            }
            
            AttestationTypeResponse response = attestationTemplateService.update(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/parametrage/attestations/types/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            attestationTemplateService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/parametrage/attestations/migrate")
    public ResponseEntity<?> migrateTemplates() {
        try {
            migrationService.migrateTemplates();
            long templateCount = migrationService.getTemplateCount();
            return ResponseEntity.ok("Migration completed successfully. Total templates: " + templateCount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Migration error: " + e.getMessage());
        }
    }
    
    @GetMapping("/parametrage/attestations/status")
    public ResponseEntity<?> getMigrationStatus() {
        try {
            long templateCount = migrationService.getTemplateCount();
            boolean travailExists = migrationService.isTemplateExists("TRAVAIL");
            boolean salaireExists = migrationService.isTemplateExists("SALAIRE");
            
            return ResponseEntity.ok(Map.of(
                "totalTemplates", templateCount,
                "travailExists", travailExists,
                "salaireExists", salaireExists,
                "status", templateCount > 0 ? "migrated" : "not_migrated"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Status check error: " + e.getMessage());
        }
    }
}
