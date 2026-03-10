package com.docappts.UserMS.dto;

import java.sql.Date;
import java.time.LocalDateTime;

import com.docappts.UserMS.entity.UserSession;

public class UserSessionDTO {
    
    String sessionId;

    int userId;

    LocalDateTime datetime;

    public UserSessionDTO() {}

    public UserSessionDTO(String sessionId, int userId, LocalDateTime datetime) {
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

    public static UserSession createUserSessionEntity(UserSessionDTO usd) {
        UserSession us = new UserSession();
        us.setDatetime(usd.getDatetime());
        us.setSessionId(usd.getSessionId());
        us.setUserId(usd.getUserId());
        return us;
    }
}
