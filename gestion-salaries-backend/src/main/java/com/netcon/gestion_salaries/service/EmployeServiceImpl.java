package com.netcon.gestion_salaries.service;

import com.netcon.gestion_salaries.dao.inteface.IEmployeDao;
import com.netcon.gestion_salaries.records.EmployeDto;
import com.netcon.gestion_salaries.service.inteface.IEmployeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeServiceImpl implements IEmployeService {
    private final IEmployeDao employeDao;

    public List<EmployeDto> findAll() {
        return employeDao.findAll();
    }

    public EmployeDto save(EmployeDto e) {
        return employeDao.save(e);
    }

    public void delete(Long id) {
        employeDao.deleteById(id);
    }

    public EmployeDto findById(Long id) {
        return employeDao.findById(id).orElse(null);
    }
}
