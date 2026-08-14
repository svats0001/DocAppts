package com.docappts.AppointmentMS.dto;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.entity.AvailableAppointment;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

public class AvailableAppointmentDTO {
    
    private int id;

    private Date date;

    private Time startTime;

    private Time endTime;

    private int practitionerId;

    private String publicId;

    public AvailableAppointmentDTO() {

    }

    public AvailableAppointmentDTO(int id, Date date, Time startTime, Time endTime, int practitionerId,
        String publicId
    ) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.id = id;
        this.practitionerId = practitionerId;
        this.publicId = publicId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPractitionerId() {
        return practitionerId;
    }

    public void setPractitionerId(int practitionerId) {
        this.practitionerId = practitionerId;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public static AvailableAppointment convertAvailableAppointmentDTO(AvailableAppointmentDTO aad) {
        AvailableAppointment aa = new AvailableAppointment();
        aa.setDate(aad.getDate());
        aa.setEndTime(aad.getEndTime());
        aa.setStartTime(aad.getStartTime());
        aa.setId(aad.getId());
        aa.setPractitionerId(aad.getPractitionerId());
        aa.setPublicId(aad.getPublicId());
        return aa;
    }
}
