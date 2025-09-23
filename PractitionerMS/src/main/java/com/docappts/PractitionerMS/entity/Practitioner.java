package com.docappts.PractitionerMS.entity;

import java.sql.Date;

import com.docappts.PractitionerMS.dto.PractitionerDTO;
import com.docappts.PractitionerMS.enums.Gender;
import com.docappts.PractitionerMS.enums.Specialty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Practitioner {
     
    @Id
    private int id;

    private String firstName;

    private String lastName;

    private String description;

    private String email;

    private String mobile;

    private Date dob;

    private Specialty specialty;

    private String photoPath;

    private Gender gender;

    /* private List<PractitionerAppointments> appointments; */

    public Practitioner() {

    }

    public Practitioner(String firstName, String lastName, String description, String email, String mobile,
    Date dob, Specialty specialty, String photoPath, Gender gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.email = email;
        this.mobile = mobile;
        this.dob = dob;
        this.specialty = specialty;
        this.photoPath = photoPath;
        this.gender = gender;
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

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setSpecialty(Specialty specialty) {
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

    public static PractitionerDTO convertPractitioner(Practitioner p) {
        PractitionerDTO pd = new PractitionerDTO();
        pd.setDescription(p.getDescription());
        pd.setDob(p.getDob());
        pd.setEmail(p.getEmail());
        pd.setFirstName(p.getFirstName());
        pd.setGender(p.getGender());
        pd.setLastName(p.getLastName());
        pd.setMobile(p.getMobile());
        pd.setPhotoPath(p.getPhotoPath());
        pd.setSpecialty(p.getSpecialty().displayName());
        return pd;
    }
}
