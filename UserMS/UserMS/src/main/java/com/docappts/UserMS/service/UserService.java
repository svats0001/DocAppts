package com.docappts.UserMS.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.docappts.UserMS.dto.UserDTO;
import com.docappts.UserMS.entity.User;
import com.docappts.UserMS.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    UserRepository ur;

    @Autowired
    MessageSource messageSource;

    @Autowired
    SessionService sessionService;

    @Autowired
    UserPasswordResetService uprService;
    
    public void createUser(UserDTO ud) throws Exception {
        try {
        User u = UserDTO.convertUserDTOEntity(ud);
        String salt = BCrypt.gensalt(12);
        u.setPassword(BCrypt.hashpw(u.getPassword(), salt));
        Optional<User> uOptional = ur.findByEmail(u.getEmail());
        if (uOptional.isPresent()) {
            throw new Exception(messageSource.getMessage("email.duplicate", null, null));
        }
        ur.saveAndFlush(u);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }

    public UserDTO checkLogin(UserDTO ud) throws Exception {
        Optional<User> uOptional = ur.findByEmail(ud.getEmail());
        if (uOptional.isPresent()) {
            User u = uOptional.get();
            if (BCrypt.checkpw(ud.getPassword(), u.getPassword())) {
                UserDTO loggedInUser = new UserDTO();
                loggedInUser = User.convertUserEntity(u);
                loggedInUser.setPassword(null);
                return loggedInUser;
            }
        }
        throw new Exception(messageSource.getMessage("invalid.login", null, null));
    }

    public UserDTO getUserByUserId(int userId, String sessionId) throws Exception {
        String result = sessionService.pollSession(sessionId);
        if (!result.equals("Session updated")) {
            throw new Exception(result);
        }
        Optional<User> uOptional = ur.findById(userId);
        if (uOptional.isPresent()) {
            User u = uOptional.get();
            return User.convertUserEntity(u);
        } throw new Exception("User not found");
    }

    @Transactional
    public String editUserDetails(String field, UserDTO user, String sessionId) {
        if (sessionService.pollSession(sessionId).equals("Session updated") || field.equals("password")) {
            Optional<User> uOptional = ur.findById(user.getId());
            if (uOptional.isPresent()) {
                User u = uOptional.get();
                switch (field) {
                    case "email":
                        if (ur.findByEmail(user.getEmail()).isPresent()) {
                            return "Another user with this email already exists";
                        }
                        u.setEmail(user.getEmail());
                        break;
                    case "password":
                        String salt = BCrypt.gensalt(12);
                        u.setPassword(BCrypt.hashpw(user.getPassword(), salt));
                        break;
                    case "firstName":
                        u.setFirstName(user.getFirstName());
                        break;
                    case "lastName":
                        u.setLastName(user.getLastName());
                        break;
                    case "dob":
                        u.setDob(user.getDob());
                        break;
                    case "gender":
                        u.setGender(user.getGender());
                        break;
                    case "mobile":
                        u.setMobile(user.getMobile());
                        break;
                    default:
                        
                } ur.saveAndFlush(u);
                uprService.deleteUserPasswordReset(u.getId());
                return "Field updated";
            }
            return "Can't find user";
        }
        return "Session doesn't exist";
    }
}
