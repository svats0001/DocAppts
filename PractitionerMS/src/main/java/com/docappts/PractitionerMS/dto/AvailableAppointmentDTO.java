package com.docappts.PractitionerMS.dto;

import java.sql.Date;
import java.sql.Time;

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
}
