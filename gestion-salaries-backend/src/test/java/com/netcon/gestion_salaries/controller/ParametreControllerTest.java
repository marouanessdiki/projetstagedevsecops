package com.netcon.gestion_salaries.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netcon.gestion_salaries.records.AttestationTypeRequest;
import com.netcon.gestion_salaries.records.AttestationTypeResponse;
import com.netcon.gestion_salaries.service.AttestationTemplateMigrationService;
import com.netcon.gestion_salaries.service.inteface.IAttestationTemplateService;
import com.netcon.gestion_salaries.service.inteface.IParametreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ParametreController.class)
class ParametreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IParametreService parametreService;

    @MockBean
    private IAttestationTemplateService attestationTemplateService;

    @MockBean
    private AttestationTemplateMigrationService migrationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAttestationTypes() throws Exception {
        List<AttestationTypeResponse> responses = List.of(
                new AttestationTypeResponse(5L, "ATTESTATION", "TRAVAIL", "Attestation Travail",
                        "<jasperReport>travail</jasperReport>"),
                new AttestationTypeResponse(6L, "ATTESTATION", "SALAIRE", "Attestation Salaire",
                        "<jasperReport>salaire</jasperReport>"),
                new AttestationTypeResponse(7L, "ATTESTATION", "TITULARISATION", "Attestation Titularisation",
                        "<jasperReport>titularisation</jasperReport>"));

        when(attestationTemplateService.getAllTypes()).thenReturn(responses);

        mockMvc.perform(get("/api/parametres/parametrage/attestations/types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].type").value("ATTESTATION"))
                .andExpect(jsonPath("$[1].value").value("SALAIRE"))
                .andExpect(jsonPath("$[2].label").value("Attestation Titularisation"));
    }

    @Test
    void testUpsertAttestationType() throws Exception {
        AttestationTypeRequest request = new AttestationTypeRequest(
                "SALAIRE",
                "<?xml version=\"1.0\"?><jasperReport></jasperReport>");

        AttestationTypeResponse response = new AttestationTypeResponse(
                1L, "ATTESTATION", "SALAIRE", "Attestation Salaire", "<jasperReport>salaire</jasperReport>");

        when(attestationTemplateService.createOrUpdate(any(AttestationTypeRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/parametres/parametrage/attestations/types")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value("SALAIRE"));
    }

    @Test
    void testCreateAttestationTypeInvalidName() throws Exception {
        AttestationTypeRequest request = new AttestationTypeRequest(
                "", // Invalid empty name
                "<?xml version=\"1.0\"?><jasperReport></jasperReport>");

        mockMvc.perform(post("/api/parametres/parametrage/attestations/types")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Name is required"));
    }

    @Test
    void testCreateAttestationTypeInvalidJrxml() throws Exception {
        AttestationTypeRequest request = new AttestationTypeRequest(
                "SALAIRE",
                "invalid jrxml" // Invalid JRXML
        );

        mockMvc.perform(post("/api/parametres/parametrage/attestations/types")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid JRXML content - must contain <jasperReport>"));
    }
}