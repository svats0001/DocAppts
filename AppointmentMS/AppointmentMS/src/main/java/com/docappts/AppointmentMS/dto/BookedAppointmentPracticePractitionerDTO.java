package com.docappts.AppointmentMS.dto;

import java.sql.Date;
import java.sql.Time;

import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.entity.BookedAppointment;

public class BookedAppointmentPracticePractitionerDTO {

    private int id;

    private Date date;

    private Time startTime;

    private Time endTime;

    private String userName;

    private String practitionerName;

    private String practiceName;

    public BookedAppointmentPracticePractitionerDTO() {

    }

    public BookedAppointmentPracticePractitionerDTO(int id, Date date, Time startTime, Time endTime, String userName, String practitionerName, String practiceName) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userName = userName;
        this.id = id;
        this.practitionerName = practitionerName;
        this.practiceName = practiceName;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPractitionerName() {
        return practitionerName;
    }

    public void setPractitionerName(String practitionerName) {
        this.practitionerName = practitionerName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPracticeName() {
        return practiceName;
    }

    public void setPracticeName(String practiceName) {
        this.practiceName = practiceName;
    }

}