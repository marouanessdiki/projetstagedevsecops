package com.netcon.gestion_salaries.dao.mappers;

import com.netcon.gestion_salaries.entity.Attestation;
import com.netcon.gestion_salaries.records.AttestationDto;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = "spring", nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface AttestationMapper extends GenericMapper<Attestation, AttestationDto> {
}
