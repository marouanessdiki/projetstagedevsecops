package com.netcon.gestion_salaries.records;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParametreDto {
    private Long id;
    private String type;
    private String value;
    private String label;
}
