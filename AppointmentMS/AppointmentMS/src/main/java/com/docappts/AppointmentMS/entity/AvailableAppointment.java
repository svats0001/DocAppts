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

    private Date date;

    private Time startTime;

    private Time endTime;

    public AvailableAppointment() {

    }

    public AvailableAppointment(Date date, Time startTime, Time endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
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

    public static AvailableAppointmentDTO convertAvailableAppointment(AvailableAppointment aa) {
        AvailableAppointmentDTO aad = new AvailableAppointmentDTO();
        aad.setDate(aa.getDate());
        aad.setEndTime(aa.getEndTime());
        aad.setStartTime(aa.getStartTime());
        aad.setId(aa.getId());
        return aad;
    }
}
