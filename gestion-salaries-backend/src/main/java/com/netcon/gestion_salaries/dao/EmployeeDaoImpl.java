package com.netcon.gestion_salaries.dao;

import com.netcon.gestion_salaries.dao.inteface.IEmployeDao;
import com.netcon.gestion_salaries.dao.mappers.EmployeMapper;
import com.netcon.gestion_salaries.entity.Employe;
import com.netcon.gestion_salaries.exceptions.EmployeException;
import com.netcon.gestion_salaries.records.EmployeDto;
import com.netcon.gestion_salaries.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EmployeeDaoImpl implements IEmployeDao {

    private final EmployeRepository employeRepository;
    private final EmployeMapper employeMapper;

    @Override
    public List<EmployeDto> findAll() {
        List<Employe> employes = employeRepository.findAll();
        return employes.stream()
                .map(employeMapper::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeDto save(EmployeDto dto) {
        Employe employe = employeMapper.fromDto(dto);
        Employe savedEmploye = employeRepository.save(employe);
        return employeMapper.fromEntity(savedEmploye);
    }

    @Override
    public void deleteById(Long id) {
        if (!employeRepository.existsById(id)) {
            throw new EmployeException("Employé n'existe pas");
        }
        employeRepository.deleteById(id);
    }

    @Override
    public Optional<EmployeDto> findById(Long id) {
        Optional<Employe> employe = employeRepository.findById(id);
        return employe.map(employeMapper::fromEntity);
    }
}
