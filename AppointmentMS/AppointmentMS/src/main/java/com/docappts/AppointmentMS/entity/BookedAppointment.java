package com.docappts.AppointmentMS.entity;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentPracticePractitionerDTO;

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

    private int paymentId;

    private int practitionerId;

    public BookedAppointment() {

    }

    public BookedAppointment(Date date, Time startTime, Time endTime, int userId, int practitionerId) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userId = userId;
        this.practitionerId = practitionerId;
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

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public int getPractitionerId() {
        return practitionerId;
    }

    public void setPractitionerId(int practitionerId) {
        this.practitionerId = practitionerId;
    }

    public static BookedAppointmentDTO convertBookedAppointment(BookedAppointment ba) {
        BookedAppointmentDTO bad = new BookedAppointmentDTO();
        bad.setDate(ba.getDate());
        bad.setEndTime(ba.getEndTime());
        bad.setStartTime(ba.getStartTime());
        bad.setId(ba.getId());
        bad.setUserId(ba.getUserId());
        bad.setPaymentId(ba.getPaymentId());
        bad.setPractitionerId(ba.getPractitionerId());
        return bad;
    }

    public static BookedAppointmentPracticePractitionerDTO convertBookedAppointmentPracticesPractitioner(BookedAppointment bad) {
        BookedAppointmentPracticePractitionerDTO ba = new BookedAppointmentPracticePractitionerDTO();
        ba.setDate(bad.getDate());
        ba.setEndTime(bad.getEndTime());
        ba.setStartTime(bad.getStartTime());
        ba.setId(bad.getId());
        return ba;
    }
}
