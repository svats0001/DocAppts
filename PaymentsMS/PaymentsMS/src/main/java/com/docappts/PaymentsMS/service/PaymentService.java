package com.docappts.PaymentsMS.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.docappts.PaymentsMS.dto.CardDTO;
import com.docappts.PaymentsMS.dto.PaymentDTO;
import com.docappts.PaymentsMS.entity.Payment;
import com.docappts.PaymentsMS.repository.CardRepository;
import com.docappts.PaymentsMS.repository.PaymentRepository;

@Service
public class PaymentService {
    
    @Autowired
    PaymentRepository repository;

    @Autowired
    CardRepository cardRepository;

    public int makePayment(PaymentDTO payment) {
        payment.setDate(LocalDateTime.now());
        Payment p = repository.saveAndFlush(PaymentDTO.convertPaymentDTO(payment));
        return p.getId();
    }

    public boolean cancelPayment(int paymentId) {
        Optional<Payment> pOptional = repository.findById(paymentId);
        try {
        if (pOptional.isPresent()) {
            Payment p = pOptional.get();
            p.setCancelledFlag(true);
            repository.saveAndFlush(p);
            return true;
        } else {
            return false;
        }} catch (Exception ex) {
            return false;
        }
        
    }
}
