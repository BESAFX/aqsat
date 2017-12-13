package com.besafx.app.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @GenericGenerator(
            name = "customerSequenceGenerator",
            strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_name", value = "CUSTOMER_SEQUENCE"),
                    @org.hibernate.annotations.Parameter(name = "initial_value", value = "1"),
                    @org.hibernate.annotations.Parameter(name = "increment_size", value = "1")
            }
    )
    @Id
    @GeneratedValue(generator = "customerSequenceGenerator")
    private Long id;

    private Integer code;

    private String name;

    private String address;

    private String mobile;

    private String identityNumber;

    @Temporal(TemporalType.TIMESTAMP)
    private Date registerDate;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String photo;

    private String email;

    @Column(columnDefinition = "boolean default true")
    private Boolean enabled;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();

    @JsonCreator
    public static Customer Create(String jsonString) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Customer customer = mapper.readValue(jsonString, Customer.class);
        return customer;
    }

    public Double getContractsAmount() {
        try {
            return this.contracts.stream().mapToDouble(Contract::getAmount).sum();
        } catch (Exception ex) {
            return 0.0;
        }
    }

    public Double getPaid() {
        try {
            return this.contracts.stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .map(ContractReceipt::getReceipt)
                    .collect(Collectors.toList())
                    .stream()
                    .mapToDouble(Receipt::getAmountNumber)
                    .sum();

        } catch (Exception ex) {
            return 0.0;
        }
    }

    public Double getRemain() {
        try {
            return this.getContractsAmount() - this.getPaid();
        } catch (Exception ex) {
            return 0.0;
        }
    }
}
