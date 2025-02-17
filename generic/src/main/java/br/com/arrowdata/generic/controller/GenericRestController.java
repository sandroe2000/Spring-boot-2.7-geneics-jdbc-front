package br.com.arrowdata.generic.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.arrowdata.generic.entity.GenericMetaData;
import br.com.arrowdata.generic.entity.GenericParameters;
import br.com.arrowdata.generic.exception.ResourceNotFoundException;
import br.com.arrowdata.generic.repository.GenericMetaDataRepository;
import br.com.arrowdata.generic.repository.GenericRepository;


@RestController
@RequestMapping("/api/v1/generic")
public class GenericRestController {

    private final  GenericRepository genericRepository;
    private final  GenericMetaDataRepository genericMetaDataRepository;

    public GenericRestController(
        GenericRepository genericRepository, 
        GenericMetaDataRepository genericMetaDataRepository){
        this.genericRepository = genericRepository;
        this.genericMetaDataRepository = genericMetaDataRepository;
    }

    @PostMapping()
    public List<Map<String, String>> getSelect(@RequestBody GenericMetaData genericMetaData) throws Exception {
        return genericRepository.getSelect(genericMetaData);
    }

    @PostMapping("/save")
    public ResponseEntity<GenericMetaData> getSave(@RequestBody GenericMetaData genericMetaData) throws Exception {
        GenericMetaData result = genericMetaDataRepository.save(genericMetaData);
        return ResponseEntity.ok( result );
    }

    @PostMapping("/find/{id}")
    public List<Map<String, String>> findById(
        @PathVariable Long id, 
        @RequestBody List<GenericParameters> genericParameters) throws Exception {

         // 1 - Buscar metadata por "id"
         GenericMetaData genericMetaData = genericMetaDataRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Id Type Not Found " + id));
         // 2 - Atribuir genericParameters => genericMetaData
                         genericMetaData.setParameters(genericParameters);
         // 3 - Executar query com genericMetaData atualizada
         return this.getSelect(genericMetaData);
    }
}
