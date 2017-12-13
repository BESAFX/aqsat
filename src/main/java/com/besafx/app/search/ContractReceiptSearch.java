package com.besafx.app.search;

import com.besafx.app.entity.ContractReceipt;
import com.besafx.app.service.ContractReceiptService;
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
public class ContractReceiptSearch {

    private final Logger log = LoggerFactory.getLogger(ContractReceiptSearch.class);

    @Autowired
    private ContractReceiptService contractReceiptService;

    public List<ContractReceipt> filter(
            /**Receipt Filters*/
            final Long receiptCodeFrom,
            final Long receiptCodeTo,
            final Long receiptDateFrom,
            final Long receiptDateTo,
            final Double receiptAmountNumberFrom,
            final Double receiptAmountNumberTo,
            /**Contract Filters*/
            final Long contractCodeFrom,
            final Long contractCodeTo,
            final Long contractRegisterDateFrom,
            final Long contractRegisterDateTo,
            final Double contractAmountFrom,
            final Double contractAmountTo,
            final String contractCustomerName,
            final String contractCustomerMobile,
            final String contractCustomerIdentityNumber,
            final String contractSupplierName,
            final String contractSupplierMobile,
            final String contractSupplierIdentityNumber
    ) {
        List<Specification> predicates = new ArrayList<>();

        /**Receipt Filters*/
        Optional.ofNullable(receiptCodeFrom)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("code"),  value)));

        Optional.ofNullable(receiptCodeTo)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("code"),  value)));

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
        Optional.ofNullable(contractCodeFrom)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("contract").get("code"),  value)));

        Optional.ofNullable(contractCodeTo)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("contract").get("code"),  value)));

        Optional.ofNullable(contractRegisterDateFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("contract").get("registerDate"), new DateTime(value).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(contractRegisterDateTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("contract").get("registerDate"), new DateTime(value).plusDays(1).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(contractAmountFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("contract").get("amount"), value)));

        Optional.ofNullable(contractAmountTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("contract").get("amount"), value)));

        Optional.ofNullable(contractCustomerName)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("customer").get("name"), "%" + value + "%")));

        Optional.ofNullable(contractCustomerMobile)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("customer").get("mobile"), "%" + value + "%")));

        Optional.ofNullable(contractCustomerIdentityNumber)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("customer").get("identityNumber"), "%" + value + "%")));

        Optional.ofNullable(contractSupplierName)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("supplier").get("name"), "%" + value + "%")));

        Optional.ofNullable(contractSupplierMobile)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("supplier").get("mobile"), "%" + value + "%")));

        Optional.ofNullable(contractSupplierIdentityNumber)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("contract").get("supplier").get("identityNumber"), "%" + value + "%")));

        if (!predicates.isEmpty()) {
            Specification result = predicates.get(0);
            for (int i = 1; i < predicates.size(); i++) {
                result = Specifications.where(result).and(predicates.get(i));
            }
            List<ContractReceipt> list = contractReceiptService.findAll(result);
            list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
            return list;
        } else {
            return new ArrayList<>();
        }
    }

    public List<ContractReceipt> findByToday() {
        List<Specification> predicates = new ArrayList<>();
        DateTime today = new DateTime().withTimeAtStartOfDay();
        DateTime tomorrow = new DateTime().plusDays(1).withTimeAtStartOfDay();
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), today.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), tomorrow.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<ContractReceipt> list = contractReceiptService.findAll(result);
        list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
        return list;
    }

    public List<ContractReceipt> findByWeek() {
        List<Specification> predicates = new ArrayList<>();
        Date weekStart = DateConverter.getCurrentWeekStart();
        Date weekEnd = DateConverter.getCurrentWeekEnd();
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), weekStart));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), weekEnd));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<ContractReceipt> list = contractReceiptService.findAll(result);
        list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
        return list;
    }

    public List<ContractReceipt> findByMonth() {
        List<Specification> predicates = new ArrayList<>();
        DateTime monthStart = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
        DateTime monthEnd = monthStart.plusMonths(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), monthStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), monthEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<ContractReceipt> list = contractReceiptService.findAll(result);
        list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
        return list;
    }

    public List<ContractReceipt> findByYear() {
        List<Specification> predicates = new ArrayList<>();
        DateTime yearStart = new DateTime().withTimeAtStartOfDay().withDayOfYear(1);
        DateTime yearEnd = yearStart.plusYears(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("receipt").get("date"), yearStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("receipt").get("date"), yearEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List<ContractReceipt> list = contractReceiptService.findAll(result);
        list.sort(Comparator.comparing(contractReceipt -> contractReceipt.getReceipt().getCode()));
        return list;
    }
}
