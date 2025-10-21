package com.netcon.gestion_salaries.service;

import com.netcon.gestion_salaries.dao.ParametreDao;
import com.netcon.gestion_salaries.records.ParametreDto;
import com.netcon.gestion_salaries.service.inteface.IParametreService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ParametreServiceImpl implements IParametreService {
    private final ParametreDao parametreDao;

    @Override
    @Cacheable(value = "parametres", key = "#type")
    public List<ParametreDto> getParametreWithType(String type) {
        return parametreDao.findByType(type);
    }
}
