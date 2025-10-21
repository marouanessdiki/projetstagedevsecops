package com.netcon.gestion_salaries.records;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeDto {
    private Long id;

    private String nom;
    private String prenom;
    private String cin;
    private String poste;
    private String service;

    private LocalDate dateEmbauche;

    private String cnssNumero;
    private Double salaire;
    private String compteBancaireNumero;
    private String sexe;
}
