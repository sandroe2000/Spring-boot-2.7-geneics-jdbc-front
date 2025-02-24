package br.com.arrowdata.generic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.arrowdata.generic.entity.GenericConfigs;

@Repository
public interface GenericConfigsRepository extends JpaRepository<GenericConfigs, Long>{
    GenericConfigs findByConfigKey(String configKey);
}
