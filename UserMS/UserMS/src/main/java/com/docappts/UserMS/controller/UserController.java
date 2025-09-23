package com.docappts.UserMS.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.UserMS.dto.UserDTO;
import com.docappts.UserMS.dto.UserPasswordResetDTO;
import com.docappts.UserMS.dto.UserSessionDTO;
import com.docappts.UserMS.service.SessionService;
import com.docappts.UserMS.service.UserPasswordResetService;
import com.docappts.UserMS.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(allowCredentials = "true", origins = "https://localhost:3000")
public class UserController {
    
    @Autowired
    UserService us;

    @Autowired
    SessionService sessionService;

    @Autowired
    UserPasswordResetService uprService;

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody UserDTO ud) throws Exception {
        us.createUser(ud);
        return ResponseEntity.status(200).body("Successfully created user");
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> checkLogin(@RequestBody UserDTO ud, HttpServletResponse response) throws Exception {
        System.out.println("Start of login");
        UserDTO user = us.checkLogin(ud);
        UserSessionDTO usd = sessionService.createSession(user.getId());
        Cookie cookie = new Cookie("sessionId", usd.getSessionId());
        cookie.setDomain("localhost");
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setSecure(true);
        response.addCookie(cookie);
        System.out.println("Inside login");
        return ResponseEntity.status(200).body(user);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<String> pollSession(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.status(200).body(sessionService.pollSession(sessionId));
    }

    @GetMapping("/logout/{sessionId}")
    public ResponseEntity<String> logout(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.status(200).body(sessionService.logout(sessionId));
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<UserDTO> getUserByUserId(@PathVariable("userId") int userId, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(us.getUserByUserId(userId, sessionId));
    }

    @PutMapping("/edit/{field}")
    public ResponseEntity<String> editUserDetails(@PathVariable("field") String field, @RequestBody UserDTO user, @RequestHeader Map<String, String> headers) {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(us.editUserDetails(field, user, sessionId));
    }

    @PostMapping("/edit/password/{userId}")
    public ResponseEntity<UserPasswordResetDTO> createPasswordResetLink(@PathVariable("userId") int userId, @RequestHeader Map<String, String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(uprService.createUserPasswordReset(userId, sessionId));
    }

    @GetMapping("/edit/password/{urlLink}")
    public ResponseEntity<UserPasswordResetDTO> getUserPasswordReset(@PathVariable("urlLink") String urlLink) throws Exception {
        return ResponseEntity.status(200).body(uprService.findUserPasswordReset(urlLink));
    }

    @PostMapping("/edit/password/email/{email}")
    public ResponseEntity<UserPasswordResetDTO> createPasswordResetLinkEmail(@PathVariable("email") String email) throws Exception {
        return ResponseEntity.status(200).body(uprService.createUserPasswordResetEmail(email));
    }
}
