package com.docappts.AppointmentMS.dto;

import java.sql.Date;
import java.sql.Time;

public class UserAppointmentDTO {

    private int bookedAppointmentId;

    private Date date;

    private Time startTime;

    private Time endTime;

    private String practiceName;

    private String practitionerName;

    private int appointmentId;

    public UserAppointmentDTO() {

    }

    public UserAppointmentDTO(int bookedAppointmentId, Date date, Time startTime, Time endTime, String practiceName, 
    String practitionerName, int appointmentId) {
        this.bookedAppointmentId = bookedAppointmentId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.practiceName = practiceName;
        this.practitionerName = practitionerName;
        this.appointmentId = appointmentId;
    }

    public int getBookedAppointmentId() {
        return bookedAppointmentId;
    }

    public void setBookedAppointmentId(int bookedAppointmentId) {
        this.bookedAppointmentId = bookedAppointmentId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
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

    public String getPracticeName() {
        return practiceName;
    }

    public void setPracticeName(String practiceName) {
        this.practiceName = practiceName;
    }

    public String getPractitionerName() {
        return practitionerName;
    }

    public void setPractitionerName(String practitionerName) {
        this.practitionerName = practitionerName;
    }
}
