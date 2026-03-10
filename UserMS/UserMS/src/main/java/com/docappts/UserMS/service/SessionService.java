package com.docappts.UserMS.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.docappts.UserMS.dto.UserSessionDTO;
import com.docappts.UserMS.entity.UserSession;
import com.docappts.UserMS.repository.SessionRepository;

@Service
public class SessionService {
    
    @Autowired
    SessionRepository repo;

    public UserSessionDTO createSession(int userId) {
        UUID uuid = UUID.randomUUID();
        String sessionId = uuid.toString();
        LocalDateTime datetime = LocalDateTime.now();
        UserSession u = repo.saveAndFlush(new UserSession(sessionId, userId, datetime));
        return UserSession.createUserSessionEntityDTO(u);
    }

    public String pollSession(String sessionId) {
        Optional<UserSession> usOptional = repo.findById(sessionId);
        if (usOptional.isPresent()) {
            UserSession us = usOptional.get();
            us.setDatetime(LocalDateTime.now());
            repo.saveAndFlush(us);
            return "Session updated";
        };
        return "Session doesn't exist";
    }

    public String logout(String sessionId) {
        Optional<UserSession> usOptional = repo.findById(sessionId);
        if (usOptional.isPresent()) {
            UserSession us = usOptional.get();
            repo.delete(us);
            return "User session deleted";
        }
        return "User session not found";
    }
}
