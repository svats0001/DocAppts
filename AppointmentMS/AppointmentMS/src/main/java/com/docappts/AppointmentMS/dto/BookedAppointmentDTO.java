package com.docappts.AppointmentMS.dto;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.entity.BookedAppointment;

public class BookedAppointmentDTO {

    private int id;

    private Date date;

    private Time startTime;

    private Time endTime;

    private int userId;

    public BookedAppointmentDTO() {

    }

    public BookedAppointmentDTO(int id, Date date, Time startTime, Time endTime, int userId) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userId = userId;
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

    public static BookedAppointment convertBookedAppointmentDTO(BookedAppointmentDTO bad) {
        BookedAppointment ba = new BookedAppointment();
        ba.setDate(bad.getDate());
        ba.setEndTime(bad.getEndTime());
        ba.setStartTime(bad.getStartTime());
        ba.setId(bad.getId());
        ba.setUserId(bad.getUserId());
        return ba;
    }
}
