package com.besafx.app.entity;

import com.besafx.app.entity.enums.AqsatMethod;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.IOException;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
public class Contract implements Serializable {

    private static final long serialVersionUID = 1L;

    @GenericGenerator(
            name = "contractSequenceGenerator",
            strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_name", value = "CONTRACT_SEQUENCE"),
                    @org.hibernate.annotations.Parameter(name = "initial_value", value = "1"),
                    @org.hibernate.annotations.Parameter(name = "increment_size", value = "1")
            }
    )
    @Id
    @GeneratedValue(generator = "contractSequenceGenerator")
    private Long id;

    private Long code;

    @Temporal(TemporalType.TIMESTAMP)
    private Date registerDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startPaymentDate;

    @Enumerated(EnumType.STRING)
    private AqsatMethod aqsatMethod;

    private Double amount;

    private Integer maxDelayInDays;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String snapshot;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String note;

    @ManyToOne
    @JoinColumn(name = "customer")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "supplier")
    private Supplier supplier;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdate;

    @ManyToOne
    @JoinColumn(name = "lastPerson")
    private Person lastPerson;

    @JsonCreator
    public static Contract Create(String jsonString) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Contract contract = mapper.readValue(jsonString, Contract.class);
        return contract;
    }

    public String getAqsatMethodInArabic() {
        try {
            return this.aqsatMethod.getName();
        } catch (Exception ex) {
            return "";
        }
    }
}
