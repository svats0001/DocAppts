package com.docappts.AppointmentMS.dto;

import java.time.LocalDateTime;

import com.docappts.AppointmentMS.entity.BookingMfaCode;

public class BookingMfaCodeDTO {
    
    String mfaCode;

    int userId;

    LocalDateTime created;

    boolean active;

    public BookingMfaCodeDTO() {
    }

    public BookingMfaCodeDTO(String mfaCode, int userId, LocalDateTime created, boolean active) {
        this.mfaCode = mfaCode;
        this.userId = userId;
        this.created = created;
        this.active = active;
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

    public BookingMfaCode convertBookingMfaCodeDTOEntity(BookingMfaCodeDTO bmcd) {
        BookingMfaCode bmc = new BookingMfaCode();
        bmc.setActive(bmcd.isActive());
        bmc.setCreated(bmcd.getCreated());
        bmc.setMfaCode(bmcd.getMfaCode());
        bmc.setUserId(bmcd.getUserId());
        return bmc;
    }
}
