package com.netcon.gestion_salaries.dao.mappers;

import com.netcon.gestion_salaries.entity.Parametre;
import com.netcon.gestion_salaries.records.ParametreDto;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = "spring", nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface ParametreMapper extends GenericMapper<Parametre, ParametreDto> {
}
