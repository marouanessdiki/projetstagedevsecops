package com.netcon.gestion_salaries.dao;

import com.netcon.gestion_salaries.dao.mappers.ParametreMapper;
import com.netcon.gestion_salaries.records.ParametreDto;
import com.netcon.gestion_salaries.repository.ParametreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ParametreDaoImpl implements ParametreDao {

    private final ParametreRepository parametreRepository;
    private final ParametreMapper parametreMapper;

    @Override
    public List<ParametreDto> findByType(String type) {
        return parametreMapper.fromList(parametreRepository.findByType(type));
    }
}
