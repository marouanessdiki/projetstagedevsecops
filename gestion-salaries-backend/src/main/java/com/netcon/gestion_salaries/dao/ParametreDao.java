package com.netcon.gestion_salaries.dao;

import com.netcon.gestion_salaries.records.ParametreDto;

import java.util.List;

public interface ParametreDao {
    List<ParametreDto> findByType(String type);
}
