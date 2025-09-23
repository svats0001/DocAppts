package com.docappts.PracticeMS.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.PracticeMS.DTO.PracticeDTO;
import com.docappts.PracticeMS.service.PracticeService;

@RestController
@RequestMapping("/practices")
public class PracticeController {
    
    @Autowired
    PracticeService pService;

    @GetMapping
    public ResponseEntity<List<PracticeDTO>> getPractices() {
        return ResponseEntity.status(200).body(pService.getPractices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable("id") int id) throws Exception {
        return ResponseEntity.status(200).body(pService.getPracticeById(id));
    }

    @GetMapping("/{name}/{phone}")
    public ResponseEntity<PracticeDTO> getPracticeByNameAndPhone(@PathVariable("name") String name,
    @PathVariable("phone") String phone) throws Exception {
        return ResponseEntity.status(200).body(pService.getPracticeByNameAndPhone(name, phone));
    }
}
