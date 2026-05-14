package com.docappts.AppointmentMS.entity;

import java.time.LocalDateTime;

import com.docappts.AppointmentMS.dto.BookingMfaCodeDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class BookingMfaCode {
    
    @Id
    String mfaCode;

    int userId;

    int availableAppointmentId;

    LocalDateTime created;

    boolean active;

    public BookingMfaCode() {
    }

    public BookingMfaCode(String mfaCode, int userId, int availableAppointmentId, LocalDateTime created, boolean active) {
        this.mfaCode = mfaCode;
        this.userId = userId;
        this.created = created;
        this.active = active;
        this.availableAppointmentId = availableAppointmentId;
    }

    public String getMfaCode() {
        return mfaCode;
    }

    public void setMfaCode(String mfaCode) {
        this.mfaCode = mfaCode;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAvailableAppointmentId() {
        return availableAppointmentId;
    }

    public void setAvailableAppointmentId(int availableAppointmentId) {
        this.availableAppointmentId = availableAppointmentId;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public BookingMfaCodeDTO convertBookingMfaCodeEntity(BookingMfaCode bmc) {
        BookingMfaCodeDTO bmcd = new BookingMfaCodeDTO();
        bmcd.setActive(bmc.isActive());
        bmcd.setCreated(bmc.getCreated());
        bmcd.setMfaCode(bmc.getMfaCode());
        bmcd.setUserId(bmc.getUserId());
        bmcd.setAvailableAppointmentId(bmc.getAvailableAppointmentId());
        return bmcd;
    }
}
