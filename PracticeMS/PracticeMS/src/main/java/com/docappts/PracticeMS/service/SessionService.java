package com.docappts.PracticeMS.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.docappts.PracticeMS.DTO.PracticeSessionDTO;
import com.docappts.PracticeMS.entity.PracticeSession;
import com.docappts.PracticeMS.repository.PracticeSessionRepository;

@Service
public class SessionService {
    
    @Autowired
    PracticeSessionRepository repo;

    public PracticeSessionDTO createSession(int practiceId) {
        UUID uuid = UUID.randomUUID();
        String sessionId = uuid.toString();
        LocalDateTime datetime = LocalDateTime.now();
        PracticeSession p = repo.saveAndFlush(new PracticeSession(sessionId, practiceId, datetime));
        return PracticeSession.createPracticeSessionDTOEntity(p);
    }

    public String pollSession(String sessionId) {
        Optional<PracticeSession> usOptional = repo.findById(sessionId);
        if (usOptional.isPresent()) {
            PracticeSession ps = usOptional.get();
            ps.setDatetime(LocalDateTime.now());
            repo.saveAndFlush(ps);
            return "Session updated";
        };
        return "Session doesn't exist";
    }

    public String logout(String sessionId) {
        Optional<PracticeSession> usOptional = repo.findById(sessionId);
        if (usOptional.isPresent()) {
            PracticeSession ps = usOptional.get();
            repo.delete(ps);
            return "User session deleted";
        }
        return "User session not found";
    }
}
