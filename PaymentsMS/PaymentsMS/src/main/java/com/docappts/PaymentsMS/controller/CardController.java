package com.docappts.PaymentsMS.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.PaymentsMS.dto.CardDTO;
import com.docappts.PaymentsMS.service.CardService;

@RestController
@CrossOrigin
@RequestMapping(value = "/card")
public class CardController {
    
    @Autowired
    CardService cardService;

    @PostMapping
    ResponseEntity<Integer> createCard(@RequestBody CardDTO card, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(cardService.createCard(card, sessionId));
    }

    @GetMapping("/{userId}")
    ResponseEntity<CardDTO> getCard(@PathVariable("userId") int userId, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        System.out.println(sessionId);

        return ResponseEntity.status(200).body(cardService.getCard(userId, sessionId));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<String> deleteCard(@PathVariable("id") int id, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(cardService.deleteCard(id, sessionId));
    }
}
