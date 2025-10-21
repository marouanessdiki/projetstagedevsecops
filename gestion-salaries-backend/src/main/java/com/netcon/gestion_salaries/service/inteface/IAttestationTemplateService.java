package com.netcon.gestion_salaries.service.inteface;

import com.netcon.gestion_salaries.entity.AttestationTemplate;
import com.netcon.gestion_salaries.records.AttestationTypeRequest;
import com.netcon.gestion_salaries.records.AttestationTypeResponse;

import java.util.List;

public interface IAttestationTemplateService {
    
    List<AttestationTypeResponse> getAllTypes();
    
    AttestationTypeResponse createOrUpdate(AttestationTypeRequest request);
    
    AttestationTypeResponse update(Long id, AttestationTypeRequest request);
    
    void delete(Long id);
    
    AttestationTemplate findByName(String name);
}
