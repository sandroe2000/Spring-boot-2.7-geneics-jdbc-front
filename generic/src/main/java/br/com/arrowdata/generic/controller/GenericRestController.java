package br.com.arrowdata.generic.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import br.com.arrowdata.generic.entity.GenericMetaData;
import br.com.arrowdata.generic.entity.GenericParameters;
import br.com.arrowdata.generic.exception.ResourceNotFoundException;
import br.com.arrowdata.generic.repository.GenericMetaDataRepository;
import br.com.arrowdata.generic.repository.GenericRepository;
import br.com.arrowdata.generic.service.GenericService;


@RestController
@RequestMapping("/api/v1/generic")
public class GenericRestController {

    private final  GenericRepository genericRepository;
    private final  GenericMetaDataRepository genericMetaDataRepository;
    private final  GenericService genericService;

    public GenericRestController(
        GenericRepository genericRepository, 
        GenericMetaDataRepository genericMetaDataRepository,
        GenericService genericService){
            this.genericRepository = genericRepository;
            this.genericMetaDataRepository = genericMetaDataRepository;
            this.genericService = genericService;
    }

    @PostMapping("/command")
    public Map<String, String> setCommand(@RequestBody String command) throws Exception {
        return genericService.setCommand(command);
    }

    @PostMapping()
    public List<Map<String, String>> getSelect(@RequestBody GenericMetaData genericMetaData) throws Exception {
        return genericRepository.getSelect(genericMetaData);
    }

    @PostMapping("/insert")
    public Map<String, String> setInsert(@RequestBody GenericMetaData genericMetaData) throws Exception {        
        Map<String, String> result = new HashMap<>();
        result.put("rowsAffected", String.valueOf(genericRepository.setInsert(genericMetaData)));
        return result;
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
         return genericRepository.getSelect(genericMetaData);
    }

    @GetMapping("/buildQuery")
    public List<Map<String, String>> buildQuery(
        @RequestParam String id, 
        @RequestParam String type) throws Exception {

        GenericParameters parameter = new GenericParameters();  
        parameter.set_key("name");
        parameter.set_value(id);
        List<GenericParameters> genericParameters = Arrays.asList(parameter);
        
        List<Map<String, String>> result = this.findById(1L, genericParameters); 
        return result;     
    }
}
