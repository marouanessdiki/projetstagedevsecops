package com.netcon.gestion_salaries.repository;

import com.netcon.gestion_salaries.entity.Parametre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParametreRepository extends JpaRepository<Parametre, Long> {
    List<Parametre> findByType(String type);
}