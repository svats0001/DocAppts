package com.docappts.UserMS.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserExceptionController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception exc) {
        return ResponseEntity.status(500).body(exc.getMessage());
    }
}
