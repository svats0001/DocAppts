package com.docappts.PaymentsMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.PaymentsMS.dto.PaymentDTO;
import com.docappts.PaymentsMS.service.PaymentService;

@RestController
@CrossOrigin
@RequestMapping(value = "/payment")
public class PaymentController {
    
    @Autowired
    PaymentService paymentService;

    @PostMapping
    ResponseEntity<Integer> makePayment(@RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.status(200).body(paymentService.makePayment(paymentDTO));
    }

    @PutMapping("/{paymentId}")
    ResponseEntity<Boolean> cancelPayment(@PathVariable("paymentId") int paymentId) {
        return ResponseEntity.status(200).body(paymentService.cancelPayment(paymentId));
    }
}
