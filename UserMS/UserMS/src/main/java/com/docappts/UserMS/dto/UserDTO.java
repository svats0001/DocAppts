package com.docappts.UserMS.dto;

import java.sql.Date;

import com.docappts.UserMS.entity.User;

public class UserDTO {
    int id;

    String email;

    String password;

    String firstName;

    String lastName;

    Date dob;

    String gender;

    String mobile;

    public UserDTO() {}

    public UserDTO(String email, String password, String firstName, String lastName, Date dob, String gender,
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

    public static User convertUserDTOEntity(UserDTO ud) {
        User u = new User();
        u.setDob(ud.getDob());
        u.setEmail(ud.getEmail());
        u.setFirstName(ud.getFirstName());
        u.setGender(ud.getGender());
        u.setLastName(ud.getLastName());
        u.setMobile(ud.getMobile());
        u.setPassword(ud.getPassword());
        u.setId(ud.getId());
        return u;
    }
}
