package com.netcon.gestion_salaries.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "employe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String cin;
    private String poste;
    private String service;

    private LocalDate dateEmbauche;

    private String cnssNumero; // CNSS N°
    private Double salaire; // Salaire
    private String compteBancaireNumero; // compte bancaire n°
    private String sexe; // Sexe (M/F)
}
