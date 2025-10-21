package com.netcon.gestion_salaries.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netcon.gestion_salaries.records.AttestationTypeRequest;
import com.netcon.gestion_salaries.records.AttestationTypeResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Transactional
public class AttestationTemplateIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String SAMPLE_JRXML = """
            <?xml version="1.0" encoding="UTF-8"?>
            <jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports"
                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                          xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports
                          http://jasperreports.sourceforge.net/xsd/jasperreport.xsd"
                          name="TestTemplate" pageWidth="595" pageHeight="842">
                <parameter name="employeId" class="java.lang.Long"/>
                <query language="sql">
                    <![CDATA[SELECT nom, prenom FROM employe WHERE id = $P{employeId}]]>
                </query>
                <field name="nom" class="java.lang.String"/>
                <field name="prenom" class="java.lang.String"/>
            </jasperReport>
            """;

    @Test
    void testCreateAndRetrieveAttestationType() throws Exception {
        AttestationTypeRequest request = new AttestationTypeRequest("TEST_TEMPLATE", SAMPLE_JRXML);

        // Create template
        HttpEntity<AttestationTypeRequest> createEntity = new HttpEntity<>(request);
        ResponseEntity<AttestationTypeResponse> createResponse = restTemplate.postForEntity(
                "/api/parametres/parametrage/attestations/types",
                createEntity,
                AttestationTypeResponse.class);

        assertEquals(HttpStatus.OK, createResponse.getStatusCode());
        assertNotNull(createResponse.getBody());
        assertEquals("TEST_TEMPLATE", createResponse.getBody().value());
        assertEquals("ATTESTATION", createResponse.getBody().type());

        AttestationTypeResponse createdTemplate = createResponse.getBody();

        // Retrieve all templates
        ResponseEntity<AttestationTypeResponse[]> getResponse = restTemplate.getForEntity(
                "/api/parametres/parametrage/attestations/types",
                AttestationTypeResponse[].class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNotNull(getResponse.getBody());
        assertTrue(getResponse.getBody().length > 0);

        // Update template
        AttestationTypeRequest updateRequest = new AttestationTypeRequest("TEST_TEMPLATE_UPDATED", SAMPLE_JRXML);
        HttpEntity<AttestationTypeRequest> updateEntity = new HttpEntity<>(updateRequest);
        ResponseEntity<AttestationTypeResponse> updateResponse = restTemplate.exchange(
                "/api/parametres/parametrage/attestations/types/" + createdTemplate.id(),
                HttpMethod.PUT,
                updateEntity,
                AttestationTypeResponse.class);

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertNotNull(updateResponse.getBody());
        assertEquals("TEST_TEMPLATE_UPDATED", updateResponse.getBody().value());

        // Delete template
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                "/api/parametres/parametrage/attestations/types/" + createdTemplate.id(),
                HttpMethod.DELETE,
                null,
                Void.class);

        assertEquals(HttpStatus.OK, deleteResponse.getStatusCode());
    }

    @Test
    void testGetAttestationTypesPublicAccess() throws Exception {
        // This should be accessible without authentication
        ResponseEntity<AttestationTypeResponse[]> response = restTemplate.getForEntity(
                "/api/parametres/parametrage/attestations/types",
                AttestationTypeResponse[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testCreateAttestationTypeValidation() throws Exception {
        AttestationTypeRequest request = new AttestationTypeRequest("", "invalid jrxml");

        HttpEntity<AttestationTypeRequest> entity = new HttpEntity<>(request);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/parametres/parametrage/attestations/types",
                entity,
                String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}