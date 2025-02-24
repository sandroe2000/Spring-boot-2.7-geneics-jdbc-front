package br.com.arrowdata.generic.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;
import br.com.arrowdata.generic.Utils.GenericUtils;
import br.com.arrowdata.generic.entity.GenericField;
import br.com.arrowdata.generic.entity.GenericMetaData;
import br.com.arrowdata.generic.entity.GenericParameters;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.Tuple;

@Repository
public class GenericRepository {

	@PersistenceContext 
    private EntityManager manager;

    public int setInsert(GenericMetaData metadata){
        /*
            ### Exemplo de metadata.get_sql():
            INSERT INTO TABLE_NAME (COL_1, COL_2) VALUES (:val_1, :val_2)

            ### Exemplo de metadata.getParameters():
            [
                {
                    parameterId: 1, _key: "val_1", _value: "VALOR_COL_1"
                },
                {
                    parameterId: 2, _key: "val_2", _value: "VALOR_COL_2"
                }
            ]
        */ 
        Query nativeQuery = manager.createNativeQuery(metadata.get_sql()); 
        for (GenericParameters param : metadata.getParameters()){
            this.setParameters(nativeQuery, param);            
        } 
        return nativeQuery.executeUpdate();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, String>> getSelect(GenericMetaData metadata){

        List<Map<String, String>> listResult = new ArrayList<>();        
        
        Query nativeQuery = manager.createNativeQuery(metadata.get_sql(), Tuple.class);
        
        for (GenericParameters param : metadata.getParameters()){
            this.setParameters(nativeQuery, param);            
        }
        
        final List<Tuple> queryRows = nativeQuery.getResultList();

        for (Tuple row: queryRows){
            Map<String, String> map = new HashMap<>();
            for(GenericField fieldName : metadata.getFieldNames()){
                map.put(fieldName.get_value(), GenericUtils.getStringFromObject(row.get(fieldName.get_value())));
            }
            listResult.add(map);
        }
        return listResult;
    }  
    
    public Query setParameters(Query nativeQuery, GenericParameters param){

        if (GenericUtils.isConvertibleToDate(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToDate(param.get_value()));
        } else if (GenericUtils.isConvertibleToInteger(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToInteger(param.get_value()));
        } else if (GenericUtils.isConvertibleToBoolean(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToBoolean(param.get_value()));
        } else if (GenericUtils.isConvertibleToLong(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToLong(param.get_value()));
        } else if (GenericUtils.isConvertibleToBoolean(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToBoolean(param.get_value()));
        } else if (GenericUtils.isConvertibleToBigInteger(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToBigInteger(param.get_value()));
        } else if (GenericUtils.isConvertibleToBigDecimal(param.get_value())){
            return nativeQuery.setParameter(param.get_key(), GenericUtils.convertibleToBigDecimal(param.get_value()));
        } else {
            return nativeQuery.setParameter(param.get_key(), param.get_value());
        }
    }
}
