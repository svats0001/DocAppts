package com.docappts.AppointmentMS.entity;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BookedAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Date date;

    private Time startTime;

    private Time endTime;

    private int userId;

    public BookedAppointment() {

    }

    public BookedAppointment(Date date, Time startTime, Time endTime, int userId) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userId = userId;
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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public static BookedAppointmentDTO convertBookedAppointment(BookedAppointment ba) {
        BookedAppointmentDTO bad = new BookedAppointmentDTO();
        bad.setDate(ba.getDate());
        bad.setEndTime(ba.getEndTime());
        bad.setStartTime(ba.getStartTime());
        bad.setId(ba.getId());
        bad.setUserId(ba.getUserId());
        return bad;
    }
}
