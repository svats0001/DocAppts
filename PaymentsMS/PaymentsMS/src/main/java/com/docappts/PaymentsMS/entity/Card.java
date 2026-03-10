package com.docappts.PaymentsMS.entity;

import java.time.LocalDate;

import com.docappts.PaymentsMS.dto.CardDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Card {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private long cardNumber;

    private String token;

    private int userId;

    public Card() {

    }

    public Card(int id, long cardNumber, String token, int userId) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.token = token;
        this.userId = userId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(long cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public static CardDTO convertCard(Card c) {
        CardDTO cd = new CardDTO();
        cd.setCardNumber(c.getCardNumber());
        cd.setId(c.getId());
        cd.setToken(c.getToken());
        cd.setUserId(c.getUserId());
        return cd;
    }
}
