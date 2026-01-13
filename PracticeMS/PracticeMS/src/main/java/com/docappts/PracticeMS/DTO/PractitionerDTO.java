package com.docappts.PracticeMS.DTO;

import java.sql.Date;

import com.docappts.PracticeMS.enums.Gender;
import com.docappts.PracticeMS.enums.Specialty;

public class PractitionerDTO {
    
    private int id;

    private String firstName;

    private String lastName;
    
    private String description;

    private String email;

    private String mobile;

    private Date dob;

    private String specialty;

    private String photoPath;

    private Gender gender;

    private AppointmentDTO appointments;

    /* private List<PractitionerAppointments> appointments; */

    public PractitionerDTO() {

    }

    public PractitionerDTO(String firstName, String lastName, String description, String email, String mobile,
    Date dob, String specialty, String photoPath, Gender gender, AppointmentDTO appointments) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.email = email;
        this.mobile = mobile;
        this.dob = dob;
        this.specialty = specialty;
        this.photoPath = photoPath;
        this.gender = gender;
        this.appointments = appointments;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public AppointmentDTO getAppointments() {
        return appointments;
    }

    public void setAppointments(AppointmentDTO appointments) {
        this.appointments = appointments;
    }
}
