package com.docappts.UserMS.entity;

import java.sql.Date;

import com.docappts.UserMS.dto.UserDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String email;

    String password;

    String firstName;

    String lastName;

    Date dob;

    String gender;

    String mobile;

    public User() {}

    public User(String email, String password, String firstName, String lastName, Date dob, String gender,
        String mobile) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.mobile = mobile;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public static UserDTO convertUserEntity(User u) {
        UserDTO ud = new UserDTO();
        ud.setDob(u.getDob());
        ud.setEmail(u.getEmail());
        ud.setFirstName(u.getFirstName());
        ud.setGender(u.getGender());
        ud.setLastName(u.getLastName());
        ud.setMobile(u.getMobile());
        ud.setPassword(u.getPassword());
        ud.setId(u.getId());
        return ud;
    }
}
