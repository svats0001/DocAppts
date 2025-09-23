package com.docappts.UserMS.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.docappts.UserMS.dto.UserPasswordResetDTO;
import com.docappts.UserMS.entity.User;
import com.docappts.UserMS.entity.UserPasswordReset;
import com.docappts.UserMS.repository.UserPasswordResetRepository;
import com.docappts.UserMS.repository.UserRepository;

@Service
public class UserPasswordResetService {
    
    @Autowired
    UserPasswordResetRepository repo;

    @Autowired
    SessionService sessionService;

    @Autowired
    UserRepository userRepo;

    public UserPasswordResetDTO createUserPasswordReset(int userId, String sessionId) throws Exception {
        String result = sessionService.pollSession(sessionId);
        if (!result.equals("Session updated")) {
            throw new Exception(result);
        }
        repo.deleteAllByUserId(userId);
        UserPasswordReset upr = new UserPasswordReset();
        String urlLink = UUID.randomUUID().toString();
        upr.setUrlLink(urlLink);
        upr.setUserId(userId);
        LocalDateTime created = LocalDateTime.now();
        upr.setCreated(created);
        UserPasswordReset saved = repo.saveAndFlush(upr);
        return UserPasswordReset.createUserPasswordResetEntityDTO(saved);
    }

    public UserPasswordResetDTO createUserPasswordResetEmail(String email) throws Exception {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            repo.deleteAllByUserId(user.getId());
            UserPasswordReset upr = new UserPasswordReset();
            String urlLink = UUID.randomUUID().toString();
            upr.setUrlLink(urlLink);
            upr.setUserId(user.getId());
            LocalDateTime created = LocalDateTime.now();
            upr.setCreated(created);
            UserPasswordReset saved = repo.saveAndFlush(upr);
            return UserPasswordReset.createUserPasswordResetEntityDTO(saved);
        } else {
            throw new Exception("User not found with this email address");
        }
    }

    public UserPasswordResetDTO findUserPasswordReset(String urlLink) throws Exception {
        Optional<UserPasswordReset> uprOptional = repo.findById(urlLink);
        if (uprOptional.isPresent()) {
            UserPasswordReset upr = uprOptional.get();
            return UserPasswordReset.createUserPasswordResetEntityDTO(upr);
        } else {
            throw new Exception("Url link not found");
        }
    }

    public void deleteUserPasswordReset(int userId) {
        repo.deleteAllByUserId(userId);
    }
}
