package com.docappts.PracticeMS.entity;

import java.time.LocalDateTime;

import com.docappts.PracticeMS.DTO.PracticeSessionDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class PracticeSession {
    
    @Id
    String sessionId;

    int practiceId;

    LocalDateTime datetime;

    public PracticeSession() {}

    public PracticeSession(String sessionId, int practiceId, LocalDateTime datetime) {
        this.sessionId = sessionId;
        this.practiceId = practiceId;
        this.datetime = datetime;
    }

    public String getSessionId() {
        return sessionId;
    } 

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public int getPracticeId() {
        return practiceId;
    } 

    public void setPracticeId(int practiceId) {
        this.practiceId = practiceId;
    }

    public LocalDateTime getDatetime() {
        return datetime;
    } 

    public void setDatetime(LocalDateTime datetime) {
        this.datetime = datetime;
    }

    public static PracticeSessionDTO createPracticeSessionDTOEntity(PracticeSession ps) {
        PracticeSessionDTO psd = new PracticeSessionDTO();
        psd.setDatetime(ps.getDatetime());
        psd.setSessionId(ps.getSessionId());
        psd.setPracticeId(ps.getPracticeId());
        return psd;
    }
}
