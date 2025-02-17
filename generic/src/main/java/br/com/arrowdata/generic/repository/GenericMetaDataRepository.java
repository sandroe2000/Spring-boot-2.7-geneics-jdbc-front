package br.com.arrowdata.generic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.arrowdata.generic.entity.GenericMetaData;

@Repository
public interface GenericMetaDataRepository extends JpaRepository<GenericMetaData, Long>{
    
}
