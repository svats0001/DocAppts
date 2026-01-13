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

    public AvailableAppointmentDTO() {

    }

    public AvailableAppointmentDTO(int id, Date date, Time startTime, Time endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.id = id;
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

    public static AvailableAppointment convertAvailableAppointmentDTO(AvailableAppointmentDTO aad) {
        AvailableAppointment aa = new AvailableAppointment();
        aa.setDate(aad.getDate());
        aa.setEndTime(aad.getEndTime());
        aa.setStartTime(aad.getStartTime());
        aa.setId(aad.getId());
        return aa;
    }
}
