package com.school.mgmt.billing.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.mgmt.billing.entity.Receipt;
import com.school.utilslibrary.constant.billing.PaymentMethod;

@RepositoryRestResource(path = "receipts")
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    @Query("SELECT r FROM Receipt r WHERE "
         + "(:studentCode IS NULL OR r.studentAccount.studentCode = :studentCode) AND "
         + "(:paymentMethod IS NULL OR r.paymentMethod = :paymentMethod) AND "
         + "(:fromDate IS NULL OR r.receiptDate >= :fromDate) AND "
         + "(:toDate IS NULL OR r.receiptDate <= :toDate)")
    Page<List<Receipt>> searchReceipts(
        @Param("studentCode") String studentCode,
        @Param("paymentMethod") PaymentMethod paymentMethod,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate,
        Pageable pageable
    );
    
}
