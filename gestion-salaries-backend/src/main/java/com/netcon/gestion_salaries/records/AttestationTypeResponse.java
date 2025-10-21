package com.netcon.gestion_salaries.records;

public record AttestationTypeResponse(
    Long id,
    String type,
    String value,
    String label,
    String jrxml
) {}
