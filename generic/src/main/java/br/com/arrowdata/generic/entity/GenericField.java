package br.com.arrowdata.generic.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "generic_fields")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericField {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fieldId;
    private String _key;
    private String _value;
}
