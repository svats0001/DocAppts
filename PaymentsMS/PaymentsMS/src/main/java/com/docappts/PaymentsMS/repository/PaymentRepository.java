package com.docappts.PaymentsMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PaymentsMS.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
}
