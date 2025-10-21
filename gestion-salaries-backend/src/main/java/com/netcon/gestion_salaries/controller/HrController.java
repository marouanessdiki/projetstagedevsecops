package com.netcon.gestion_salaries.controller;

import com.netcon.gestion_salaries.entity.Hr;
import com.netcon.gestion_salaries.repository.HrRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "http://localhost:3000")
public class HrController {
    private final HrRepository hrRepository;

    public HrController(HrRepository hrRepository) {
        this.hrRepository = hrRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Nom d'utilisateur et mot de passe requis"));
        }
        
        if (hrRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Ce nom d'utilisateur existe déjà"));
        }
        
        Hr hr = new Hr();
        hr.setUsername(username);
        hr.setPassword(password);
        hr.setApproved(false);
        
        hrRepository.save(hr);
        return ResponseEntity.ok(Map.of("success", true, "message", "Inscription réussie. En attente d'approbation par l'administrateur."));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Hr>> getPendingHrs() {
        List<Hr> pendingHrs = hrRepository.findAll().stream()
                .filter(hr -> !hr.isApproved())
                .toList();
        return ResponseEntity.ok(pendingHrs);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveHr(@PathVariable Long id) {
        return hrRepository.findById(id)
                .map(hr -> {
                    hr.setApproved(true);
                    hrRepository.save(hr);
                    return ResponseEntity.ok(Map.of("success", true, "message", "HR approuvé avec succès"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // For demo, get the first HR user or create default data
        Hr hr = hrRepository.findAll().stream().findFirst().orElse(null);
        
        Map<String, Object> profile;
        if (hr != null) {
            profile = Map.of(
                "fullName", hr.getFullName() != null ? hr.getFullName() : "Manager RH",
                "email", hr.getEmail() != null ? hr.getEmail() : "hr@netcon.ma",
                "phone", hr.getPhone() != null ? hr.getPhone() : "+212 6 12 34 56 78",
                "department", hr.getDepartment(),
                "position", hr.getPosition(),
                "darkTheme", hr.getDarkTheme() != null ? hr.getDarkTheme() : false
            );
        } else {
            profile = Map.of(
                "fullName", "Manager RH",
                "email", "hr@netcon.ma",
                "phone", "+212 6 12 34 56 78",
                "department", "Ressources Humaines",
                "position", "Responsable RH",
                "darkTheme", false
            );
        }
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData) {
        try {
            // For demo, update the first HR user
            Hr hr = hrRepository.findAll().stream().findFirst().orElse(null);
            
            if (hr != null) {
                hr.setFullName((String) profileData.get("fullName"));
                hr.setEmail((String) profileData.get("email"));
                hr.setPhone((String) profileData.get("phone"));
                hr.setPosition((String) profileData.get("position"));
                hr.setDepartment((String) profileData.get("department"));
                hr.setDarkTheme((Boolean) profileData.get("darkTheme"));
                
                hrRepository.save(hr);
            }
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Profil mis à jour avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Erreur lors de la mise à jour"));
        }
    }
    
} 