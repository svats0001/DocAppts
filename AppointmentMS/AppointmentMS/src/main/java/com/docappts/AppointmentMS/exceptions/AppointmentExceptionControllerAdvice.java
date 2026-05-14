package com.docappts.AppointmentMS.exceptions;

import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppointmentExceptionControllerAdvice {
    
    @ExceptionHandler(ConcurrencyFailureException.class)
    public ResponseEntity<String> handleConcurrencyFailureException(ConcurrencyFailureException exc) {
        return ResponseEntity.status(409).body("Appointment already booked");
    }
}
