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
@Table(name = "generic_parameters")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericParameters {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long parameterId;
    private String _key;
    private String _value;
}
