package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.Person;
import com.besafx.app.entity.Supplier;
import com.besafx.app.service.*;
import com.besafx.app.util.JSONConverter;
import com.besafx.app.util.Options;
import com.besafx.app.ws.Notification;
import com.besafx.app.ws.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.util.SquigglyUtils;
import com.google.common.collect.Lists;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/supplier/")
public class SupplierRest {

    private final static Logger log = LoggerFactory.getLogger(SupplierRest.class);

    public static final String FILTER_TABLE = "**,contracts[id],-supplierReceipts";
    public static final String FILTER_SUPPLIER_COMBO = "id,code,name,mobile,balance";

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierReceiptService supplierReceiptService;

    @Autowired
    private ContractReceiptService contractReceiptService;

    @Autowired
    private ContractAttachService contractAttachService;

    @Autowired
    private AttachService attachService;

    @Autowired
    private ContractService contractService;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_CREATE')")
    public String create(@RequestBody Supplier supplier, Principal principal) {
        Supplier topSupplier = supplierService.findTopByOrderByCodeDesc();
        if (topSupplier == null) {
            supplier.setCode(1);
        } else {
            supplier.setCode(topSupplier.getCode() + 1);
        }
        supplier.setRegisterDate(new Date());
        supplier.setEnabled(true);
        supplier = supplierService.save(supplier);
        Person caller = personService.findByEmail(principal.getName());
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء حساب التاجر بنجاح" : "Create Supplier Account Successfully").type("success").icon("fa-plus-square").build(), principal.getName());
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplier);
    }

    @RequestMapping(value = "update", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_UPDATE')")
    public String update(@RequestBody Supplier supplier, Principal principal) {
        if (supplierService.findByCodeAndIdIsNot(supplier.getCode(), supplier.getId()) != null) {
            throw new CustomException("هذا الكود مستخدم سابقاً، فضلاً قم بتغير الكود.");
        }
        Supplier object = supplierService.findOne(supplier.getId());
        if (object != null) {
            supplier = supplierService.save(supplier);
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم تعديل بيانات حساب التاجر بنجاح" : "Update Supplier Account Information Successfully").type("warning").icon("fa-edit").build(), principal.getName());
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplier);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "enable/{supplierId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_DOCTOR_ENABLE')")
    @Transactional
    public String enable(@PathVariable(value = "supplierId") Long supplierId, Principal principal) {
        Supplier supplier = supplierService.findOne(supplierId);
        if (supplier != null) {
            supplier.setEnabled(true);
            supplier = supplierService.save(supplier);
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplier);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "disable/{supplierId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_DOCTOR_DISABLE')")
    @Transactional
    public String disable(@PathVariable(value = "supplierId") Long supplierId, Principal principal) {
        Supplier supplier = supplierService.findOne(supplierId);
        if (supplier != null) {
            supplier.setEnabled(false);
            supplier = supplierService.save(supplier);
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplier);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_DELETE')")
    public void delete(@PathVariable Long id, Principal principal) throws InterruptedException {
        Supplier supplier = supplierService.findOne(id);
        if (supplier != null) {

            log.info("Delete All SupplierReceipts");
            supplierReceiptService.delete(supplier.getSupplierReceipts());

            Thread.sleep(500);

            log.info("Delete All Receipts");
            receiptService.delete(supplier.getSupplierReceipts().stream()
                    .map(supplierReceipt -> supplierReceipt.getReceipt())
                    .collect(Collectors.toList()));

            Thread.sleep(500);

            log.info("Delete All ContractReceipts");
            contractReceiptService.delete(supplier.getContracts().stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .collect(Collectors.toList())
            );

            Thread.sleep(500);

            log.info("Delete All Receipts");
            receiptService.delete(supplier.getContracts().stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .map(contractReceipt -> contractReceipt.getReceipt())
                    .collect(Collectors.toList())
            );

            Thread.sleep(500);

            log.info("Delete All ContractAttach");
            contractAttachService.delete(supplier.getContracts().stream()
                    .flatMap(contract -> contract.getContractAttaches().stream())
                    .collect(Collectors.toList())
            );

            log.info("Delete All Attach");
            attachService.delete(supplier.getContracts().stream()
                            .flatMap(contract -> contract.getContractAttaches().stream())
                            .map(contractAttach -> contractAttach.getAttach())
                            .collect(Collectors.toList()));

            Thread.sleep(500);

            log.info("Delete All Contracts");
            contractService.delete(supplier.getContracts());

            log.info("Delete Supplier");
            supplierService.delete(id);

            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف حساب التاجر وكل ما يتعلق به من حسابات وعقود بنجاح" : "Delete Supplier Account With All Related Successfully").type("error").icon("fa-trash").build(), principal.getName());
        }
    }

    @RequestMapping(value = "findAll", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findAll() {
        List<Supplier> list = Lists.newArrayList(supplierService.findAll());
        list.sort(Comparator.comparing(Supplier::getCode));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findAllCombo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findAllCombo() {
        List<Supplier> list = Lists.newArrayList(supplierService.findAll());
        list.sort(Comparator.comparing(Supplier::getCode));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_SUPPLIER_COMBO), list);
    }

    @RequestMapping(value = "findOne/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findOne(@PathVariable Long id) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierService.findOne(id));
    }
}
