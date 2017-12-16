package com.besafx.app.entity;

import com.besafx.app.entity.enums.ReceiptType;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @GenericGenerator(
            name = "supplierSequenceGenerator",
            strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_name", value = "SUPPLIER_SEQUENCE"),
                    @org.hibernate.annotations.Parameter(name = "initial_value", value = "1"),
                    @org.hibernate.annotations.Parameter(name = "increment_size", value = "1")
            }
    )
    @Id
    @GeneratedValue(generator = "supplierSequenceGenerator")
    private Long id;

    private Integer code;

    private String name;

    private String address;

    private String mobile;

    private String identityNumber;

    @Temporal(TemporalType.TIMESTAMP)
    private Date registerDate;

    private String email;

    @Column(columnDefinition = "boolean default true")
    private Boolean enabled;

    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();

    @JsonCreator
    public static Supplier Create(String jsonString) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Supplier supplier = mapper.readValue(jsonString, Supplier.class);
        return supplier;
    }

    public Double getBalance() {
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
                    .filter(contractReceipt -> contractReceipt.getReceipt().getReceiptType().equals(ReceiptType.Out))
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
            return this.getBalance() - this.getPaid();
        } catch (Exception ex) {
            return 0.0;
        }
    }
}
