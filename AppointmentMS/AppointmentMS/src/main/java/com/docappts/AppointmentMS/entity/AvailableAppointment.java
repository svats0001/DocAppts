package com.docappts.AppointmentMS.entity;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AvailableAppointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    int practitionerId;

    private Date date;

    private Time startTime;

    private Time endTime;

    private String publicId;

    public AvailableAppointment() {

    }

    public AvailableAppointment(Date date, Time startTime, Time endTime, int practitionerId, String publicId) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
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

    public static AvailableAppointmentDTO convertAvailableAppointment(AvailableAppointment aa) {
        AvailableAppointmentDTO aad = new AvailableAppointmentDTO();
        aad.setDate(aa.getDate());
        aad.setEndTime(aa.getEndTime());
        aad.setStartTime(aa.getStartTime());
        aad.setId(aa.getId());
        aad.setPractitionerId(aa.getPractitionerId());
        aad.setPublicId(aa.getPublicId());
        return aad;
    }
}
