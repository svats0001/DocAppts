package com.docappts.UserMS.dto;

import java.time.LocalDateTime;

import com.docappts.UserMS.entity.UserPasswordReset;

public class UserPasswordResetDTO {
    
    String urlLink;

    int userId;

    LocalDateTime created;

    public UserPasswordResetDTO() {

    }

    public UserPasswordResetDTO(String urlLink, int userId, LocalDateTime created) {
        this.urlLink = urlLink;
        this.userId = userId;
        this.created = created;
    }

    public void setUrlLink(String urlLink) {
        this.urlLink = urlLink;
    }

    public String getUrlLink() {
        return this.urlLink;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return this.userId;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getCreated() {
        return this.created;
    }

    public static UserPasswordReset createUserPasswordResetEntity(UserPasswordResetDTO uprd) {
        UserPasswordReset upr = new UserPasswordReset();
        upr.setCreated(uprd.getCreated());
        upr.setUrlLink(uprd.getUrlLink());
        upr.setUserId(uprd.getUserId());
        return upr;
    }
}
