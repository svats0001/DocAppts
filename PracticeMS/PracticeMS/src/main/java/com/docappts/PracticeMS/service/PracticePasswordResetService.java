package com.docappts.PracticeMS.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.docappts.PracticeMS.DTO.PracticePasswordResetDTO;
import com.docappts.PracticeMS.entity.Practice;
import com.docappts.PracticeMS.entity.PracticePasswordReset;
import com.docappts.PracticeMS.repository.PracticePasswordResetRepository;
import com.docappts.PracticeMS.repository.PracticeRepository;

import jakarta.transaction.Transactional;

@Service
public class PracticePasswordResetService {
    
    @Autowired
    PracticePasswordResetRepository repo;

    @Autowired
    SessionService sessionService;

    @Autowired
    PracticeRepository practiceRepo;

    public PracticePasswordResetDTO createPracticePasswordReset(int practiceId, String sessionId) throws Exception {
        String result = sessionService.pollSession(sessionId);
        if (!result.equals("Session updated")) {
            throw new Exception(result);
        }
        repo.deleteAllByPracticeId(practiceId);
        PracticePasswordReset upr = new PracticePasswordReset();
        String urlLink = UUID.randomUUID().toString();
        upr.setUrlLink(urlLink);
        upr.setPracticeId(practiceId);
        LocalDateTime created = LocalDateTime.now();
        upr.setCreated(created);
        PracticePasswordReset saved = repo.saveAndFlush(upr);
        return PracticePasswordReset.createPracticePasswordResetEntityDTO(saved);
    }

    @Transactional
    public PracticePasswordResetDTO createPracticePasswordResetEmail(String email) throws Exception {
        Optional<Practice> practiceOptional = practiceRepo.findByEmail(email);
        if (practiceOptional.isPresent()) {
            Practice p = practiceOptional.get();
            repo.deleteAllByPracticeId(p.getId());
            PracticePasswordReset upr = new PracticePasswordReset();
            String urlLink = UUID.randomUUID().toString();
            upr.setUrlLink(urlLink);
            upr.setPracticeId(p.getId());
            LocalDateTime created = LocalDateTime.now();
            upr.setCreated(created);
            PracticePasswordReset saved = repo.saveAndFlush(upr);
            return PracticePasswordReset.createPracticePasswordResetEntityDTO(saved);
        } else {
            throw new Exception("Practice not found with this email address");
        }
    }

    public PracticePasswordResetDTO findPracticePasswordReset(String urlLink) throws Exception {
        Optional<PracticePasswordReset> uprOptional = repo.findById(urlLink);
        if (uprOptional.isPresent()) {
            PracticePasswordReset upr = uprOptional.get();
            return PracticePasswordReset.createPracticePasswordResetEntityDTO(upr);
        } else {
            throw new Exception("Url link not found");
        }
    }

    public void deletePracticePasswordReset(int practiceId) {
        repo.deleteAllByPracticeId(practiceId);
    }
}
