package com.besafx.app.search;

import com.besafx.app.entity.Contract;
import com.besafx.app.service.ContractService;
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
public class ContractSearch {

    private final Logger log = LoggerFactory.getLogger(ContractSearch.class);

    @Autowired
    private ContractService contractService;

    public List<Contract> filter(
            final Long code,
            final Long registerDateFrom,
            final Long registerDateTo,
            final Double amountFrom,
            final Double amountTo,
            final String customerName,
            final String customerMobile,
            final String customerIdentityNumber,
            final String supplierName,
            final String supplierMobile,
            final String supplierIdentityNumber
    ) {
        List<Specification> predicates = new ArrayList<>();

        Optional.ofNullable(code)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("code").as(String.class), "%" + value + "%")));

        Optional.ofNullable(registerDateFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("registerDate"), new DateTime(value).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(registerDateTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("registerDate"), new DateTime(value).plusDays(1).withTimeAtStartOfDay().toDate())));

        Optional.ofNullable(amountFrom)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.greaterThanOrEqualTo(root.get("amount"), value)));

        Optional.ofNullable(amountTo)
                .ifPresent(value -> predicates.add((root, cq, cb) ->
                        cb.lessThanOrEqualTo(root.get("amount"), value)));

        Optional.ofNullable(customerName)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("customer").get("name"), "%" + value + "%")));

        Optional.ofNullable(customerMobile)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("customer").get("mobile"), "%" + value + "%")));

        Optional.ofNullable(customerIdentityNumber)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("customer").get("identityNumber"), "%" + value + "%")));

        Optional.ofNullable(supplierName)
                .ifPresent(value ->
                        predicates.add((root, cq, cb) -> cb.like(root.get("supplier").get("mobile"), "%" + value + "%")));

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
            List<Contract> list = contractService.findAll(result);
            list.sort(Comparator.comparing(Contract::getCode));
            return list;
        } else {
            return new ArrayList<>();
        }
    }

    public List<Contract> findByToday() {
        List<Specification> predicates = new ArrayList<>();
        DateTime today = new DateTime().withTimeAtStartOfDay();
        DateTime tomorrow = new DateTime().plusDays(1).withTimeAtStartOfDay();
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("registerDate"), today.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("registerDate"), tomorrow.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List list = contractService.findAll(result);
        list.sort(Comparator.comparing(Contract::getCode).reversed());
        return list;
    }

    public List<Contract> findByWeek() {
        List<Specification> predicates = new ArrayList<>();
        Date weekStart = DateConverter.getCurrentWeekStart();
        Date weekEnd = DateConverter.getCurrentWeekEnd();
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("registerDate"), weekStart));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("registerDate"), weekEnd));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List list = contractService.findAll(result);
        list.sort(Comparator.comparing(Contract::getCode).reversed());
        return list;
    }

    public List<Contract> findByMonth() {
        List<Specification> predicates = new ArrayList<>();
        DateTime monthStart = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
        DateTime monthEnd = monthStart.plusMonths(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("registerDate"), monthStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("registerDate"), monthEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List list = contractService.findAll(result);
        list.sort(Comparator.comparing(Contract::getCode).reversed());
        return list;
    }

    public List<Contract> findByYear() {
        List<Specification> predicates = new ArrayList<>();
        DateTime yearStart = new DateTime().withTimeAtStartOfDay().withDayOfYear(1);
        DateTime yearEnd = yearStart.plusYears(1).minusDays(1);
        predicates.add((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("registerDate"), yearStart.toDate()));
        predicates.add((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("registerDate"), yearEnd.toDate()));
        Specification result = predicates.get(0);
        for (int i = 1; i < predicates.size(); i++) {
            result = Specifications.where(result).and(predicates.get(i));
        }
        List list = contractService.findAll(result);
        list.sort(Comparator.comparing(Contract::getCode).reversed());
        return list;
    }
}
