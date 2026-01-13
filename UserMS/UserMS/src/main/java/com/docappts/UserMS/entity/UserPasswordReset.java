package com.docappts.UserMS.entity;

import java.time.LocalDateTime;

import com.docappts.UserMS.dto.UserPasswordResetDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserPasswordReset {
    
    @Id
    String urlLink;

    int userId;

    LocalDateTime created;

    public UserPasswordReset() {

    }

    public UserPasswordReset(String urlLink, int userId, LocalDateTime created) {
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

    public static UserPasswordResetDTO createUserPasswordResetEntityDTO(UserPasswordReset upr) {
        UserPasswordResetDTO uprd = new UserPasswordResetDTO();
        uprd.setCreated(upr.getCreated());
        uprd.setUrlLink(upr.getUrlLink());
        uprd.setUserId(upr.getUserId());
        return uprd;
    }
}
