package com.besafx.app.rest;

import com.besafx.app.config.CustomException;
import com.besafx.app.entity.Person;
import com.besafx.app.entity.Receipt;
import com.besafx.app.entity.SupplierReceipt;
import com.besafx.app.entity.enums.ReceiptType;
import com.besafx.app.service.PersonService;
import com.besafx.app.service.ReceiptService;
import com.besafx.app.service.SupplierReceiptService;
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
    private SupplierReceiptService supplierReceiptService;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_SUPPLIER_RECEIPT_CREATE')")
    public String create(@RequestBody SupplierReceipt supplierReceipt, Principal principal) {
        if (supplierReceipt.getReceipt().getAmountNumber() == 0) {
            throw new CustomException("لا يمكن إنشاء سند بقيمة صفر");
        }
        Person caller = personService.findByEmail(principal.getName());
        Receipt topReceipt = receiptService.findTopByOrderByCodeDesc();
        if (topReceipt == null) {
            supplierReceipt.getReceipt().setCode(new Long(1));
        } else {
            supplierReceipt.getReceipt().setCode(topReceipt.getCode() + 1);
        }
        supplierReceipt.getReceipt().setAmountString(ArabicLiteralNumberParser.literalValueOf(supplierReceipt.getReceipt().getAmountNumber()));
        supplierReceipt.getReceipt().setReceiptType(ReceiptType.In);
        supplierReceipt.getReceipt().setDate(new DateTime().toDate());
        supplierReceipt.getReceipt().setLastUpdate(new DateTime().toDate());
        supplierReceipt.getReceipt().setLastPerson(caller);
        supplierReceipt.setReceipt(receiptService.save(supplierReceipt.getReceipt()));
        supplierReceipt = supplierReceiptService.save(supplierReceipt);
        String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
        notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم انشاء سند الصرف بنجاح" : "Create Seller Receipt Successfully").type("success").build(), principal.getName());
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), supplierReceipt);
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
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم حذف سند الصرف وكل ما يتعلق به من حسابات بنجاح" : "Delete Seller Receipt With All Related Successfully").type("error").build(), principal.getName());
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
}
