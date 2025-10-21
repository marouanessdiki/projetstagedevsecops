package com.netcon.gestion_salaries.util;

import org.springframework.stereotype.Component;

@Component
public class TemplateValidator {
    
    private static final String NAME_PATTERN = "^[A-Z_]{2,40}$";
    
    public void validateName(String name) {
        if (name == null || !name.matches(NAME_PATTERN)) {
            throw new IllegalArgumentException("Name must be 2–40 chars, uppercase letters/underscores.");
        }
    }
    
    public void validateJrxmlLooksValid(String jrxml) {
        if (jrxml == null || jrxml.trim().isEmpty()) {
            throw new IllegalArgumentException("JRXML content cannot be empty.");
        }
        if (!jrxml.contains("<jasperReport")) {
            throw new IllegalArgumentException("Invalid JRXML content - must contain <jasperReport>");
        }
    }
    
    public void validateRequest(String name, String jrxml) {
        validateName(name);
        validateJrxmlLooksValid(jrxml);
    }
}
