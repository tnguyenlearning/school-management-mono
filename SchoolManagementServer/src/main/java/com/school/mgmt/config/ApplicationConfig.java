package com.school.mgmt.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

	private final EntityManager entityManager;

	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	RepositoryRestConfigurer repositoryRestConfigurer() {
		return RepositoryRestConfigurer.withConfig(config -> {
			// Avoid returning bodies for delete operations because lazy-loading issue
			config.setReturnBodyOnDelete(false);

			// Expose IDs for all entities in the EntityManager's metamodel
			config.exposeIdsFor(
					entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));
		});
	}

}
