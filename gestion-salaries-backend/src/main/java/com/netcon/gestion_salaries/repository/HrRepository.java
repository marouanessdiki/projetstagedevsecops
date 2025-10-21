package com.netcon.gestion_salaries.repository;

import com.netcon.gestion_salaries.entity.Hr;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HrRepository extends JpaRepository<Hr, Long> {
    Optional<Hr> findByUsername(String username);
} 