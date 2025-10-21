package com.netcon.gestion_salaries.service.inteface;

import com.netcon.gestion_salaries.entity.Attestation;
import com.netcon.gestion_salaries.records.AttestationDto;

import java.util.List;
import java.util.Optional;

public interface IAttestationService {
    List<AttestationDto> findByEmploye(Long employeId);
    
    AttestationDto save(AttestationDto attestation) ;
    
    List<AttestationDto> findAll() ;
    
    AttestationDto findById(Long id) ;
    
    AttestationDto generateAndSave(AttestationDto attestation) throws Exception ;
    
    byte[] generateAttestation(String typeName, Long employeId, java.util.Map<String, Object> params);
    
    void deleteById(Long id);
}
