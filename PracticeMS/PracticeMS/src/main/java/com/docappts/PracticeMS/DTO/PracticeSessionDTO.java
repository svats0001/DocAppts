package com.docappts.PracticeMS.DTO;

import java.time.LocalDateTime;

import com.docappts.PracticeMS.entity.PracticeSession;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class PracticeSessionDTO {
    
    @Id
    String sessionId;

    int practiceId;

    LocalDateTime datetime;

    public PracticeSessionDTO() {}

    public PracticeSessionDTO(String sessionId, int practiceId, LocalDateTime datetime) {
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

    public static PracticeSession createPracticeSessionEntity(PracticeSessionDTO psd) {
        PracticeSession ps = new PracticeSession();
        ps.setDatetime(psd.getDatetime());
        ps.setSessionId(psd.getSessionId());
        ps.setPracticeId(psd.getPracticeId());
        return ps;
    }
}
