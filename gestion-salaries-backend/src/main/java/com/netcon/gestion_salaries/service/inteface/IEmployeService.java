package com.netcon.gestion_salaries.service.inteface;

import com.netcon.gestion_salaries.records.EmployeDto;

import java.util.List;

public interface IEmployeService {
    List<EmployeDto> findAll() ;
    
    EmployeDto save(EmployeDto e) ;
    
    void delete(Long id) ;
    
    EmployeDto findById(Long id);
                
}
