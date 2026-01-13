package com.docappts.PractitionerMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.PractitionerMS.dto.PractitionerDTO;
import com.docappts.PractitionerMS.service.PractitionerService;

@RestController
public class PractitionerController {
    
    @Autowired
    PractitionerService pService;

    @GetMapping("/{id}/{practiceId}")
    public ResponseEntity<PractitionerDTO> getPractitionerById(@PathVariable("id") int id, @PathVariable("practiceId") int practiceId) throws Exception {
        return ResponseEntity.status(200).body(pService.getPractitionerById(id, practiceId));
    }

    @GetMapping("/practitioners/{email}/{mobile}")
    public ResponseEntity<PractitionerDTO> getPractitionerByEmailAndMobile(@PathVariable("email") String email, @PathVariable("mobile") String mobile) throws Exception {
        return ResponseEntity.status(200).body(pService.getPractitionerByEmailAndMobile(email, mobile));
    }
}
