package com.netcon.gestion_salaries.dao.mappers;

import java.util.List;

public interface GenericMapper<Entity, Dto> {
    Dto fromEntity(Entity dto);

    Entity fromDto(Dto entity);

    List<Dto> fromList(List<Entity> entity);
}
