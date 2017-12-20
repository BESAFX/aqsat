package com.besafx.app.search;

import com.besafx.app.entity.SupplierReceipt;
import com.besafx.app.entity.enums.ReceiptType;
import com.besafx.app.service.SupplierReceiptService;
import com.besafx.app.util.DateConverter;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SupplierReceiptSearch {

    private final Logger log = LoggerFactory.getLogger(SupplierReceiptSearch.class);

    @Autowired
    private SupplierReceiptService supplierReceiptService;

    public List<SupplierReceipt> filter(
            /**Receipt Filters*/
            final ReceiptType receiptType,
            final Long receiptCodeFrom,
            final Long receiptCodeTo,
            final Long receiptDateFrom,
            final Long receiptDateTo,
            final Double receiptAmountNumberFrom,
            final Double receiptAmountNumberTo,
            /**Contract Filters*/
            final Long supplierCodeFrom,
            final Long supplierCodeTo,
            final String supplierName,
            final String supplierMobile,
            final String supplierIdentityNumber
    ) {
        List<Specification> predicates = new ArrayList<>();

        /**Receipt Filters*/
        Optional.ofNullable(receiptType)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.equal(root.get("receipt").get("receiptType"), value)));

        Optional.ofNullable(receiptCodeFrom)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("code"), value)));

        Optional.ofNullable(receiptCodeTo)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("code"), value)));

        Optional.ofNullable(receiptDateFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("receipt").get("registerDate"), new DateTime(value).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(receiptDateTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("receipt").get("registerDate"), new DateTime(value).plusDays(1).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(receiptAmountNumberFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("receipt").get("amountNumber"), value)));

        Optional.ofNullable(receiptAmountNumberTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("receipt").get("amountNumber"), value)));

        /**Contract Filters*/
        Optional.ofNullable(supplierCodeFrom)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("supplier").get("code"), value)));

        Optional.ofNullable(supplierCodeTo)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("supplier").get("code"), value)));

        Optional.ofNullable(supplierName)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("supplier").get("name"), "%" + value + "%")));

        Optional.ofNullable(supplierMobile)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("supplier").get("mobile"), "%" + value + "%")));

        Optional.ofNullable(supplierIdentityNumber)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("supplier").get("identityNumber"), "%" + value + "%")));

        if (!predicates.isEmpty()) {
            Specification result = predicates.get(0);
            for (int i = 1; i < predicates.size(); i++) {
                result = Specifications.where(result).and(predicates.get(i));
            }
            List<SupplierReceipt> list = supplierReceiptService.findAll(result);
            list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
            return list;
        } else {
            return new ArrayList<>();
        }
    }

    public List<SupplierReceipt> findByToday(final ReceiptType receiptType) {
        List<Specification> predicates = new ArrayList<>();
        DateTime today = new DateTime().withTimeAtStartOfDay();
        DateTime tomorrow = new DateTime().plusDays(1).withTimeAtStartOfDay();
        predicates.add((root, cq, cb) -> cb.equal(root.get("receipt").get("receiptType"), receiptType));
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), today.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), tomorrow.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<SupplierReceipt> list = supplierReceiptService.findAll(result);
        list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
        return list;
    }

    public List<SupplierReceipt> findByWeek(final ReceiptType receiptType) {
        List<Specification> predicates = new ArrayList<>();
        Date weekStart = DateConverter.getCurrentWeekStart();
        Date weekEnd = DateConverter.getCurrentWeekEnd();
        predicates.add((root, cq, cb) -> cb.equal(root.get("receipt").get("receiptType"), receiptType));
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), weekStart));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), weekEnd));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<SupplierReceipt> list = supplierReceiptService.findAll(result);
        list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
        return list;
    }

    public List<SupplierReceipt> findByMonth(final ReceiptType receiptType) {
        List<Specification> predicates = new ArrayList<>();
        DateTime monthStart = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
        DateTime monthEnd = monthStart.plusMonths(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.equal(root.get("receipt").get("receiptType"), receiptType));
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), monthStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), monthEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<SupplierReceipt> list = supplierReceiptService.findAll(result);
        list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
        return list;
    }

    public List<SupplierReceipt> findByYear(final ReceiptType receiptType) {
        List<Specification> predicates = new ArrayList<>();
        DateTime yearStart = new DateTime().withTimeAtStartOfDay().withDayOfYear(1);
        DateTime yearEnd = yearStart.plusYears(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.equal(root.get("receipt").get("receiptType"), receiptType));
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), yearStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), yearEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<SupplierReceipt> list = supplierReceiptService.findAll(result);
        list.sort(Comparator.comparing(supplierReceipt -> supplierReceipt.getReceipt().getCode()));
        return list;
    }
}
