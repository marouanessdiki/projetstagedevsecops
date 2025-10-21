package com.netcon.gestion_salaries.service.inteface;

import com.netcon.gestion_salaries.records.ParametreDto;

import java.util.List;

public interface IParametreService {
    List<ParametreDto> getParametreWithType(String type);
}
