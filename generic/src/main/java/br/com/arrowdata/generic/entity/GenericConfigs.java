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
@Table(name = "generic_configs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericConfigs {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long configId;
    private String configKey;
    private String configValue;
}
