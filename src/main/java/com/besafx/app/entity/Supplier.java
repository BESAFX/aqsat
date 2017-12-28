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

    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<SupplierReceipt> supplierReceipts = new ArrayList<>();

    @JsonCreator
    public static Supplier Create(String jsonString) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Supplier supplier = mapper.readValue(jsonString, Supplier.class);
        return supplier;
    }

    public List<Customer> findCustomers(){
        try{
            return this.contracts.stream().map(Contract::getCustomer).collect(Collectors.toList());
        }catch (Exception ex){
            return new ArrayList<>();
        }
    }

    public Double getContractsPaidSum() {
        try {
            return this.contracts.stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .map(contractReceipt -> contractReceipt.getReceipt())
                    .mapToDouble(Receipt::getAmountNumber).sum();
        } catch (Exception ex) {
            return 0.0;
        }
    }

    public Double getReceiptsInSum() {
        try {
            return this.supplierReceipts.stream()
                    .map(SupplierReceipt::getReceipt)
                    .filter(receipt -> receipt.getReceiptType().equals(ReceiptType.In))
                    .mapToDouble(receipt -> receipt.getAmountNumber())
                    .sum();
        } catch (Exception ex) {
            return 0.0;
        }
    }

    public Double getReceiptsOutSum() {
        try {
            return this.supplierReceipts.stream()
                    .map(SupplierReceipt::getReceipt)
                    .filter(receipt -> receipt.getReceiptType().equals(ReceiptType.Out))
                    .mapToDouble(receipt -> receipt.getAmountNumber())
                    .sum();
        } catch (Exception ex) {
            return 0.0;
        }
    }

    public Double getBalance() {
        try {
            return (getContractsPaidSum() + getReceiptsInSum()) - getReceiptsOutSum();
        } catch (Exception ex) {
            return 0.0;
        }
    }
}
