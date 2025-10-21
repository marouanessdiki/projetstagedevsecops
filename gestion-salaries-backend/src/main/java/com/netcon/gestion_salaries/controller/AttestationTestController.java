package com.netcon.gestion_salaries.controller;

import com.netcon.gestion_salaries.controller.data.AttestationCmd;
import com.netcon.gestion_salaries.controller.mappers.AttestationCmdMapper;
import com.netcon.gestion_salaries.records.AttestationDto;
import com.netcon.gestion_salaries.service.inteface.IAttestationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test/attestations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class AttestationTestController {

    private final IAttestationService attestationService;
    private final AttestationCmdMapper attestationMapper;

    @PostMapping
    public ResponseEntity<?> testSave(@RequestBody AttestationCmd attestationCmd) {
        try {
            log.info("=== TEST CONTROLLER === Starting attestation test");
            log.info("Received AttestationCmd: {}", attestationCmd);
            
            // Validate required fields
            if (attestationCmd.getEmployeId() == null) {
                log.error("Employee ID is null");
                return ResponseEntity.badRequest()
                        .body("Error: employeId is required");
            }
            if (attestationCmd.getTypeAttestation() == null || attestationCmd.getTypeAttestation().trim().isEmpty()) {
                log.error("Type attestation is null or empty");
                return ResponseEntity.badRequest()
                        .body("Error: typeAttestation is required");
            }
            
            log.info("Converting AttestationCmd to AttestationDto...");
            AttestationDto attestationDto = attestationMapper.from(attestationCmd);
            log.info("Converted AttestationDto: {}", attestationDto);
            
            // Test the service call
            log.info("Calling attestationService.generateAndSave...");
            AttestationDto result = attestationService.generateAndSave(attestationDto);
            log.info("Service call successful. Result: {}", result);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error in test controller: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body("Error generating attestation: " + e.getMessage());
        }
    }
}
