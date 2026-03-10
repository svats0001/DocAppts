package com.docappts.PaymentsMS.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.docappts.PaymentsMS.dto.CardDTO;
import com.docappts.PaymentsMS.dto.PaymentDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    int userId;

    int appointmentId;

    LocalDateTime date;

    double amount;

    Long cardNumber;

    boolean cancelledFlag;

    public Payment() {

    }

    public Payment(int id, int userId, int appointmentId, LocalDateTime date, double amount, Long cardNumber) {
        this.id = id;
        this.userId = userId;
        this.appointmentId = appointmentId;
        this.date = date;
        this.amount = amount;
        this.cardNumber = cardNumber;
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

    public Long getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(Long cardNumber) {
        this.cardNumber = cardNumber;
    }

    public boolean getCancelledFlag() {
        return cancelledFlag;
    }

    public void setCancelledFlag(boolean cancelledFlag) {
        this.cancelledFlag = cancelledFlag;
    }

    public static PaymentDTO convertPayment(Payment p) {
        PaymentDTO pd = new PaymentDTO();
        pd.setAmount(p.getAmount());
        pd.setAppointmentId(p.getAppointmentId());
        pd.setDate(p.getDate());
        pd.setId(p.getId());
        pd.setUserId(p.getUserId());
        pd.setCancelledFlag(p.getCancelledFlag());
        CardDTO cd = new CardDTO();
        cd.setCardNumber(p.getCardNumber());
        pd.setCard(cd);
        return pd;
    }
}
