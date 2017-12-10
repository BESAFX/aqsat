package com.besafx.app.service;

import com.besafx.app.entity.ContractReceipt;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public interface ContractReceiptService extends PagingAndSortingRepository<ContractReceipt, Long>, JpaSpecificationExecutor<ContractReceipt> {
    List<ContractReceipt> findByContractId(Long id);
}

