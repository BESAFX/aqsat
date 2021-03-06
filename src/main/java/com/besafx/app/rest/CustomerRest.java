package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.Customer;
import com.besafx.app.entity.Person;
import com.besafx.app.search.CustomerSearch;
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
@RequestMapping(value = "/api/customer/")
public class CustomerRest {

    private final static Logger log = LoggerFactory.getLogger(CustomerRest.class);

    public static final String FILTER_TABLE = "**,contracts[id]";
    public static final String FILTER_CUSTOMER_INFO = "id,code,name,registerDate,mobile,identityNumber,nationality,job,enabled,contractsAmount,paid,remain,contracts[id]";
    public static final String FILTER_CUSTOMER_COMBO = "id,code,name,mobile,identityNumber";

    @Autowired
    private CustomerService customerService;

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
    private CustomerSearch customerSearch;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CUSTOMER_CREATE')")
    public String create(@RequestBody Customer customer, Principal principal) {
        Customer topCustomer = customerService.findTopByOrderByCodeDesc();
        if (topCustomer == null) {
            customer.setCode(1);
        } else {
            customer.setCode(topCustomer.getCode() + 1);
        }
        customer.setRegisterDate(new Date());
        customer.setEnabled(true);
        customer = customerService.save(customer);
        Person caller = personService.findByEmail(principal.getName());
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء حساب العميل بنجاح" : "Create Customer Account Successfully").type("success").build(), principal.getName());
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), customer);
    }

    @RequestMapping(value = "update", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CUSTOMER_UPDATE')")
    public String update(@RequestBody Customer customer, Principal principal) {
        if (customerService.findByCodeAndIdIsNot(customer.getCode(), customer.getId()) != null) {
            throw new CustomException("هذا الكود مستخدم سابقاً، فضلاً قم بتغير الكود.");
        }
        Customer object = customerService.findOne(customer.getId());
        if (object != null) {
            customer = customerService.save(customer);
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم تعديل بيانات حساب العميل بنجاح" : "Update Customer Account Information Successfully").type("warning").build(), principal.getName());
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), customer);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "enable/{customerId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_DOCTOR_ENABLE')")
    @Transactional
    public String enable(@PathVariable(value = "customerId") Long customerId, Principal principal) {
        Customer customer = customerService.findOne(customerId);
        if (customer != null) {
            customer.setEnabled(true);
            customer = customerService.save(customer);
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), customer);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "disable/{customerId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_DOCTOR_DISABLE')")
    @Transactional
    public String disable(@PathVariable(value = "customerId") Long customerId, Principal principal) {
        Customer customer = customerService.findOne(customerId);
        if (customer != null) {
            customer.setEnabled(false);
            customer = customerService.save(customer);
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), customer);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CUSTOMER_DELETE')")
    public void delete(@PathVariable Long id, Principal principal) throws Exception{
        Customer customer = customerService.findOne(id);
        if (customer != null) {
            log.info("Delete All ContractReceipts");
            contractReceiptService.delete(customer.getContracts().stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .collect(Collectors.toList())
            );

            Thread.sleep(500);

            log.info("Delete All Receipts");
            receiptService.delete(customer.getContracts().stream()
                    .flatMap(contract -> contract.getContractReceipts().stream())
                    .map(contractReceipt -> contractReceipt.getReceipt())
                    .collect(Collectors.toList())
            );

            Thread.sleep(500);

            log.info("Delete All ContractAttach");
            contractAttachService.delete(customer.getContracts().stream()
                    .flatMap(contract -> contract.getContractAttaches().stream())
                    .collect(Collectors.toList())
            );

            log.info("Delete All Attach");
            attachService.delete(customer.getContracts().stream()
                    .flatMap(contract -> contract.getContractAttaches().stream())
                    .map(contractAttach -> contractAttach.getAttach())
                    .collect(Collectors.toList()));

            Thread.sleep(500);

            log.info("Delete All Contracts");
            contractService.delete(customer.getContracts());

            log.info("Delete Customer Finally");
            customerService.delete(id);

            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف حساب العميل وكل ما يتعلق به من حسابات بنجاح" : "Delete Customer Account With All Related Successfully").type("error").build(), principal.getName());
        }
    }

    @RequestMapping(value = "findAll", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findAll() {
        List<Customer> list = Lists.newArrayList(customerService.findAll());
        list.sort(Comparator.comparing(Customer::getCode));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findAllInfo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findAllInfo() {
        List<Customer> list = Lists.newArrayList(customerService.findAll());
        list.sort(Comparator.comparing(Customer::getCode));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_CUSTOMER_INFO), list);
    }

    @RequestMapping(value = "findAllCombo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findAllCombo() {
        List<Customer> list = Lists.newArrayList(customerService.findAll());
        list.sort(Comparator.comparing(Customer::getCode));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_CUSTOMER_COMBO), list);
    }

    @RequestMapping(value = "findOne/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findOne(@PathVariable Long id) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), customerService.findOne(id));
    }

    @RequestMapping(value = "filter", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String filter(
            @RequestParam(value = "code", required = false) final String code,
            @RequestParam(value = "name", required = false) final String name,
            @RequestParam(value = "mobile", required = false) final String mobile,
            @RequestParam(value = "identityNumber", required = false) final String identityNumber,
            @RequestParam(value = "email", required = false) final String email) {
        List<Customer> list = customerSearch.filter(code, name, mobile, identityNumber, email);
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_CUSTOMER_INFO), list);
    }
}
