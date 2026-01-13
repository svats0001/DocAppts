package com.docappts.PaymentsMS.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.docappts.PaymentsMS.entity.Payment;

public class PaymentDTO {
    
    int id;

    int userId;

    int appointmentId;

    LocalDateTime date;

    double amount;

    CardDTO card;

    boolean cancelledFlag;

    public PaymentDTO() {

    }

    public PaymentDTO(int id, int userId, int appointmentId, LocalDateTime date, double amount, CardDTO card) {
        this.id = id;
        this.userId = userId;
        this.appointmentId = appointmentId;
        this.date = date;
        this.amount = amount;
        this.card = card;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public CardDTO getCard() {
        return card;
    }

    public void setCard(CardDTO card) {
        this.card = card;
    }

    public boolean getCancelledFlag() {
        return cancelledFlag;
    }

    public void setCancelledFlag(boolean cancelledFlag) {
        this.cancelledFlag = cancelledFlag;
    }

    public static Payment convertPaymentDTO(PaymentDTO pd) {
        Payment p = new Payment();
        p.setAmount(pd.getAmount());
        p.setAppointmentId(pd.getAppointmentId());
        p.setDate(pd.getDate());
        p.setId(pd.getId());
        p.setUserId(pd.getUserId());
        p.setCardNumber(pd.getCard().getCardNumber());
        p.setCancelledFlag(pd.getCancelledFlag());
        return p;
    }
}
