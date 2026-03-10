package com.docappts.PracticeMS.DTO;

import java.time.LocalDateTime;

import com.docappts.PracticeMS.DTO.PracticePasswordResetDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

public class PracticePasswordResetDTO {
    
    @Id
    String urlLink;

    int practiceId;

    LocalDateTime created;

    public PracticePasswordResetDTO() {

    }

    public PracticePasswordResetDTO(String urlLink, int practiceId, LocalDateTime created) {
        this.urlLink = urlLink;
        this.practiceId = practiceId;
        this.created = created;
    }

    public void setUrlLink(String urlLink) {
        this.urlLink = urlLink;
    }

    public String getUrlLink() {
        return this.urlLink;
    }

    public void setPracticeId(int practiceId) {
        this.practiceId = practiceId;
    }

    public int getPracticeId() {
        return this.practiceId;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getCreated() {
        return this.created;
    }

    public static PracticePasswordResetDTO createPracticePasswordResetEntityDTO(PracticePasswordResetDTO upr) {
        PracticePasswordResetDTO uprd = new PracticePasswordResetDTO();
        uprd.setCreated(upr.getCreated());
        uprd.setUrlLink(upr.getUrlLink());
        uprd.setPracticeId(upr.getPracticeId());
        return uprd;
    }
}
