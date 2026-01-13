package com.docappts.AppointmentMS.dto;

import java.time.LocalDate;

public class CardDTO {
    
    private int id;

    private long cardNumber;

    private String token;

    private int userId;


    public CardDTO() {

    }

    public CardDTO(int id, long cardNumber, String token, int userId) {
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
}
