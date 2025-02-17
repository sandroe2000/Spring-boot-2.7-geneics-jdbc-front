package br.com.arrowdata.generic.entity;

import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "generic_metadata")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericMetaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metadataId;

    @Size(max = 4000)
    private String _sql;

    @OneToMany(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "metadata_id")
    private List<GenericField> fieldNames;

    @OneToMany(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "metadata_id")
    private List<GenericParameters> parameters;
    
    private String _limit;
    private String _offset;
}
