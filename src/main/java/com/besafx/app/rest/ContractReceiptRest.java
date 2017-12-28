package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.ContractReceipt;
import com.besafx.app.entity.Person;
import com.besafx.app.entity.enums.ReceiptType;
import com.besafx.app.search.ContractReceiptSearch;
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

    public static final String FILTER_TABLE = "**,contract[id,code,customer[id,name],supplier[id,name]],receipt[**,lastPerson[id,nickname,name]]";

    @Autowired
    private ContractReceiptService contractReceiptService;

    @Autowired
    private ContractReceiptSearch contractReceiptSearch;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "create/{receiptType}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_RECEIPT_IN_CREATE')")
    public String create(@PathVariable(value = "receiptType") ReceiptType receiptType, @RequestBody ContractReceipt contractReceipt, Principal principal) {
        if (contractReceipt.getReceipt().getAmountNumber() == 0) {
            throw new CustomException("لا يمكن إنشاء سند بقيمة صفر");
        }
        Person caller = personService.findByEmail(principal.getName());
        if (receiptService.findByCode(contractReceipt.getReceipt().getCode()) != null) {
            throw new CustomException("رقم السند غير متاح، فضلاً ادخل رقم آخر");
        }
        contractReceipt.getReceipt().setAmountString(ArabicLiteralNumberParser.literalValueOf(contractReceipt.getReceipt().getAmountNumber()));
        contractReceipt.getReceipt().setReceiptType(receiptType);
        contractReceipt.getReceipt().setLastUpdate(new DateTime().toDate());
        contractReceipt.getReceipt().setLastPerson(caller);
        contractReceipt.setReceipt(receiptService.save(contractReceipt.getReceipt()));
        contractReceipt = contractReceiptService.save(contractReceipt);
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء سند القبض بنجاح" : "Create Contract Receipt Successfully").type("success").build(), principal.getName());
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceipt);
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_RECEIPT_IN_DELETE')")
    public void delete(@PathVariable Long id, Principal principal) {
        ContractReceipt contractReceipt = contractReceiptService.findOne(id);
        if (contractReceipt != null) {
            contractReceiptService.delete(contractReceipt);
            receiptService.delete(contractReceipt.getReceipt());
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف سند القبض وكل ما يتعلق به من حسابات بنجاح" : "Delete Contract Receipt With All Related Successfully").type("error").build(), principal.getName());
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

    @RequestMapping(value = "filter", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String filter(
            /**Receipt Filters*/
            @RequestParam(value = "receiptType", required = false) final ReceiptType receiptType,
            @RequestParam(value = "receiptCodeFrom", required = false) final Long receiptCodeFrom,
            @RequestParam(value = "receiptCodeTo", required = false) final Long receiptCodeTo,
            @RequestParam(value = "receiptDateFrom", required = false) final Long receiptDateFrom,
            @RequestParam(value = "receiptDateTo", required = false) final Long receiptDateTo,
            @RequestParam(value = "receiptAmountNumberFrom", required = false) final Double receiptAmountNumberFrom,
            @RequestParam(value = "receiptAmountNumberTo", required = false) final Double receiptAmountNumberTo,
            /**Contract Filters*/
            @RequestParam(value = "contractCodeFrom", required = false) final Long contractCodeFrom,
            @RequestParam(value = "contractCodeTo", required = false) final Long contractCodeTo,
            @RequestParam(value = "contractRegisterDateFrom", required = false) final Long contractRegisterDateFrom,
            @RequestParam(value = "contractRegisterDateTo", required = false) final Long contractRegisterDateTo,
            @RequestParam(value = "contractAmountFrom", required = false) final Double contractAmountFrom,
            @RequestParam(value = "contractAmountTo", required = false) final Double contractAmountTo,
            @RequestParam(value = "contractCustomerName", required = false) final String contractCustomerName,
            @RequestParam(value = "contractCustomerMobile", required = false) final String contractCustomerMobile,
            @RequestParam(value = "contractCustomerIdentityNumber", required = false) final String contractCustomerIdentityNumber,
            @RequestParam(value = "contractSupplierName", required = false) final String contractSupplierName,
            @RequestParam(value = "contractSupplierMobile", required = false) final String contractSupplierMobile,
            @RequestParam(value = "contractSupplierIdentityNumber", required = false) final String contractSupplierIdentityNumber
    ) {
        List<ContractReceipt> list = contractReceiptSearch.filter(
                receiptType,
                receiptCodeFrom,
                receiptCodeTo,
                receiptDateFrom,
                receiptDateTo,
                receiptAmountNumberFrom,
                receiptAmountNumberTo,
                contractCodeFrom,
                contractCodeTo,
                contractRegisterDateFrom,
                contractRegisterDateTo,
                contractAmountFrom,
                contractAmountTo,
                contractCustomerName,
                contractCustomerMobile,
                contractCustomerIdentityNumber,
                contractSupplierName,
                contractSupplierMobile,
                contractSupplierIdentityNumber
        );
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findByToday/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByToday(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceiptSearch.findByToday(receiptType));
    }

    @RequestMapping(value = "findByWeek/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByWeek(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceiptSearch.findByWeek(receiptType));
    }

    @RequestMapping(value = "findByMonth/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByMonth(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceiptSearch.findByMonth(receiptType));
    }

    @RequestMapping(value = "findByYear/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByYear(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractReceiptSearch.findByYear(receiptType));
    }
}
