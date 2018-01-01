package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.Person;
import com.besafx.app.entity.SupplierReceipt;
import com.besafx.app.entity.enums.ReceiptType;
import com.besafx.app.search.SupplierReceiptSearch;
import com.besafx.app.service.PersonService;
import com.besafx.app.service.ReceiptService;
import com.besafx.app.service.SupplierReceiptService;
import com.besafx.app.service.SupplierService;
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
@RequestMapping(value = "/api/supplierReceipt/")
public class SupplierReceiptRest {

    private final static Logger log = LoggerFactory.getLogger(SupplierReceiptRest.class);

    public static final String FILTER_TABLE = "**,supplier[id,code,name],receipt[**,lastPerson[id,nickname,name]]";

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierReceiptService supplierReceiptService;

    @Autowired
    private SupplierReceiptSearch supplierReceiptSearch;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    private SupplierReceipt create(ReceiptType receiptType, SupplierReceipt supplierReceipt, String byEmail) {
        if (supplierReceipt.getReceipt().getAmountNumber() == 0) {
            throw new CustomException("لا يمكن إنشاء سند بقيمة صفر");
        }
        Person caller = personService.findByEmail(byEmail);
        if (receiptService.findByCode(supplierReceipt.getReceipt().getCode()) != null) {
            throw new CustomException("رقم السند غير متاح، فضلاً ادخل رقم آخر");
        }
        supplierReceipt.getReceipt().setAmountString(ArabicLiteralNumberParser.literalValueOf(supplierReceipt.getReceipt().getAmountNumber()));
        supplierReceipt.getReceipt().setReceiptType(receiptType);
        supplierReceipt.getReceipt().setDate(new DateTime().toDate());
        supplierReceipt.getReceipt().setLastUpdate(new DateTime().toDate());
        supplierReceipt.getReceipt().setLastPerson(caller);
        supplierReceipt.setReceipt(receiptService.save(supplierReceipt.getReceipt()));
        supplierReceipt = supplierReceiptService.save(supplierReceipt);
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء السند بنجاح" : "Create Receipt Successfully").type("success").build(), byEmail);
        return supplierReceipt;
    }

    @RequestMapping(value = "createIn", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_RECEIPT_IN_CREATE')")
    public String createIn(@RequestBody SupplierReceipt supplierReceipt, Principal principal) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), create(ReceiptType.In, supplierReceipt, principal.getName()));
    }

    @RequestMapping(value = "createOut", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_RECEIPT_OUT_CREATE')")
    public String createOut(@RequestBody SupplierReceipt supplierReceipt, Principal principal) {
        Double supplierBalance = supplierService.findOne(supplierReceipt.getSupplier().getId()).getBalance();
        if(supplierReceipt.getReceipt().getAmountNumber() > supplierBalance){
            throw new CustomException("لا يمكن صرف قيمة أكبر من رصيد التاجر = ".concat(supplierBalance.toString()));
        }
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), create(ReceiptType.Out, supplierReceipt, principal.getName()));
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_RECEIPT_DELETE')")
    public void delete(@PathVariable Long id, Principal principal) {
        SupplierReceipt supplierReceipt = supplierReceiptService.findOne(id);
        if (supplierReceipt != null) {
            supplierReceiptService.delete(supplierReceipt);
            receiptService.delete(supplierReceipt.getReceipt());
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف سند القبض وكل ما يتعلق به من حسابات بنجاح" : "Delete Supplier Receipt With All Related Successfully").type("error").build(), principal.getName());
        }
    }

    @RequestMapping(value = "findBySupplier/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findBySupplier(@PathVariable Long id) {
        List<SupplierReceipt> list = Lists.newArrayList(supplierReceiptService.findBySupplierId(id));
        list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findOne/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findOne(@PathVariable Long id) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceiptService.findOne(id));
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
            /**Supplier Filters*/
            @RequestParam(value = "supplierCodeFrom", required = false) final Long supplierCodeFrom,
            @RequestParam(value = "supplierCodeTo", required = false) final Long supplierCodeTo,
            @RequestParam(value = "supplierName", required = false) final String supplierName,
            @RequestParam(value = "supplierMobile", required = false) final String supplierMobile,
            @RequestParam(value = "supplierIdentityNumber", required = false) final String supplierIdentityNumber
    ) {
        List<SupplierReceipt> list = supplierReceiptSearch.filter(
                receiptType,
                receiptCodeFrom,
                receiptCodeTo,
                receiptDateFrom,
                receiptDateTo,
                receiptAmountNumberFrom,
                receiptAmountNumberTo,
                supplierCodeFrom,
                supplierCodeTo,
                supplierName,
                supplierMobile,
                supplierIdentityNumber
        );
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), list);
    }

    @RequestMapping(value = "findByToday/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByToday(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceiptSearch.findByToday(receiptType));
    }

    @RequestMapping(value = "findByWeek/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByWeek(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceiptSearch.findByWeek(receiptType));
    }

    @RequestMapping(value = "findByMonth/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByMonth(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceiptSearch.findByMonth(receiptType));
    }

    @RequestMapping(value = "findByYear/{receiptType}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByYear(@PathVariable(value = "receiptType") ReceiptType receiptType) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceiptSearch.findByYear(receiptType));
    }
}
