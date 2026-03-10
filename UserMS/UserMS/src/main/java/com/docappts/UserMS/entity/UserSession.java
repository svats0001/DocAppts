package com.docappts.UserMS.entity;

import java.sql.Date;
import java.time.LocalDateTime;

import com.docappts.UserMS.dto.UserSessionDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserSession {
    
    @Id
    String sessionId;

    int userId;

    LocalDateTime datetime;

    public UserSession() {}

    public UserSession(String sessionId, int userId, LocalDateTime datetime) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.datetime = datetime;
    }

    public String getSessionId() {
        return sessionId;
    } 

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public int getUserId() {
        return userId;
    } 

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public LocalDateTime getDatetime() {
        return datetime;
    } 

    public void setDatetime(LocalDateTime datetime) {
        this.datetime = datetime;
    }

    public static UserSessionDTO createUserSessionEntityDTO(UserSession us) {
        UserSessionDTO usd = new UserSessionDTO();
        usd.setDatetime(us.getDatetime());
        usd.setSessionId(us.getSessionId());
        usd.setUserId(us.getUserId());
        return usd;
    }
}
