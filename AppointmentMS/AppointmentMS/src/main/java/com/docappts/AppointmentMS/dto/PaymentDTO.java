package com.docappts.AppointmentMS.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PaymentDTO {

    int userId;

    int appointmentId;

    LocalDateTime date;

    double amount;

    CardDTO card;

    public PaymentDTO() {

    }

    public PaymentDTO(int userId, int appointmentId, LocalDateTime date, double amount, CardDTO card) {
        this.userId = userId;
        this.appointmentId = appointmentId;
        this.date = date;
        this.amount = amount;
        this.card = card;
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
}
