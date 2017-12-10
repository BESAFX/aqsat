package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.ContractReceipt;
import com.besafx.app.entity.Person;
import com.besafx.app.entity.Receipt;
import com.besafx.app.entity.enums.ReceiptType;
import com.besafx.app.service.ContractReceiptService;
import com.besafx.app.service.PersonService;
import com.besafx.app.service.ReceiptService;
import com.besafx.app.util.ArabicLiteralNumberParser;
import com.besafx.app.util.JSONConverter;
import com.besafx.app.util.Options;
import com.besafx.app.ws.Notification;
import com.besafx.app.ws.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.util.SquigglyUtils;
import com.google.common.collect.Lists;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping(value = "/api/contractReceipt/")
public class ContractReceiptRest {

    private final static Logger log = LoggerFactory.getLogger(ContractReceiptRest.class);

    public static final String FILTER_TABLE = "**,contract[id,code,registerDate],receipt[**,lastPerson[id,nickname,name]]";

    @Autowired
    private ContractReceiptService contractReceiptService;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_RECEIPT_CREATE')")
    public String create(@RequestBody ContractReceipt contractReceipt, Principal principal) {
        if (contractReceipt.getReceipt().getAmountNumber() == 0) {
            throw new CustomException("لا يمكن إنشاء سند بقيمة صفر");
        }
        Person caller = personService.findByEmail(principal.getName());
        Receipt topReceipt = receiptService.findTopByOrderByCodeDesc();
        if (topReceipt == null) {
            contractReceipt.getReceipt().setCode(new Long(1));
        } else {
            contractReceipt.getReceipt().setCode(topReceipt.getCode() + 1);
        }
        contractReceipt.getReceipt().setAmountString(ArabicLiteralNumberParser.literalValueOf(contractReceipt.getReceipt().getAmountNumber()));
        contractReceipt.getReceipt().setReceiptType(ReceiptType.In);
        contractReceipt.getReceipt().setDate(new DateTime().toDate());
        contractReceipt.getReceipt().setLastUpdate(new DateTime().toDate());
        contractReceipt.getReceipt().setLastPerson(caller);
        contractReceipt.setReceipt(receiptService.save(contractReceipt.getReceipt()));
        contractReceipt = contractReceiptService.save(contractReceipt);
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء السند بنجاح" : "Create Receipt Successfully").type("success").build(), principal.getName());
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceipt);
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_RECEIPT_DELETE')")
    public void delete(@PathVariable Long id, Principal principal) {
        ContractReceipt contractReceipt = contractReceiptService.findOne(id);
        if (contractReceipt != null) {
            contractReceiptService.delete(contractReceipt);
            receiptService.delete(contractReceipt.getReceipt());
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف السند وكل ما يتعلق به من حسابات بنجاح" : "Delete Receipt With All Related Successfully").type("error").build(), principal.getName());
        }
    }

    @RequestMapping(value = "findByContract/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByContract(@PathVariable Long id) {
        List<ContractReceipt> list = Lists.newArrayList(contractReceiptService.findByContractId(id));
        list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findOne/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findOne(@PathVariable Long id) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceiptService.findOne(id));
    }
}
