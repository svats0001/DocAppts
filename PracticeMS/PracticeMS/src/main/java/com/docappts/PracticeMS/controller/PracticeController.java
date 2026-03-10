package com.docappts.PracticeMS.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.PracticeMS.DTO.PracticeDTO;
import com.docappts.PracticeMS.DTO.PracticePasswordResetDTO;
import com.docappts.PracticeMS.DTO.PracticeSessionDTO;
import com.docappts.PracticeMS.service.PracticePasswordResetService;
import com.docappts.PracticeMS.service.PracticeService;
import com.docappts.PracticeMS.service.SessionService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/practices")
public class PracticeController {
    
    @Autowired
    PracticeService pService;

    @Autowired
    SessionService sessionService;

    @Autowired
    PracticePasswordResetService pprService;

    @GetMapping
    public ResponseEntity<List<PracticeDTO>> getPractices() {
        return ResponseEntity.status(200).body(pService.getPractices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable("id") int id) throws Exception {
        return ResponseEntity.status(200).body(pService.getPracticeById(id));
    }

    @GetMapping("/{name}/{phone}")
    public ResponseEntity<PracticeDTO> getPracticeByNameAndPhone(@PathVariable("name") String name,
    @PathVariable("phone") String phone) throws Exception {
        return ResponseEntity.status(200).body(pService.getPracticeByNameAndPhone(name, phone));
    }

    @PostMapping
    public ResponseEntity<PracticeDTO> createPractice(@RequestBody PracticeDTO pDTO) throws Exception {
        return ResponseEntity.status(200).body(pService.createPractice(pDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<PracticeDTO> checkPracticeLogin(@RequestBody PracticeDTO pDTO, HttpServletResponse response) throws Exception {
        PracticeDTO pd = pService.checkPracticeLogin(pDTO);
        PracticeSessionDTO usd = sessionService.createSession(pd.getId());
        Cookie cookie = new Cookie("sessionId", usd.getSessionId());
        cookie.setDomain("localhost");
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setSecure(true);
        response.addCookie(cookie);
        return ResponseEntity.status(200).body(pd);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<String> pollSession(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.status(200).body(sessionService.pollSession(sessionId));
    }

    @GetMapping("/logout/{sessionId}")
    public ResponseEntity<String> logout(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.status(200).body(sessionService.logout(sessionId));
    }

    @PostMapping("/edit/password/{practiceId}")
    public ResponseEntity<PracticePasswordResetDTO> createPasswordResetLink(@PathVariable("practiceId") int practiceId, @RequestHeader Map<String, String> headers) throws Exception {
        String sessionId = headers.get("practicesessionid");
        return ResponseEntity.status(200).body(pprService.createPracticePasswordReset(practiceId, sessionId));
    }

    @GetMapping("/edit/password/{urlLink}")
    public ResponseEntity<PracticePasswordResetDTO> getPracticePasswordReset(@PathVariable("urlLink") String urlLink) throws Exception {
        return ResponseEntity.status(200).body(pprService.findPracticePasswordReset(urlLink));
    }

    @PostMapping("/edit/password/email/{email}")
    public ResponseEntity<PracticePasswordResetDTO> createPasswordResetLinkEmail(@PathVariable("email") String email) throws Exception {
        return ResponseEntity.status(200).body(pprService.createPracticePasswordResetEmail(email));
    }

    @PutMapping("/edit/{field}")
    public ResponseEntity<String> editPracticeDetails(@PathVariable("field") String field, @RequestBody PracticeDTO practice, @RequestHeader Map<String, String> headers) {
        String practiceSessionId = headers.get("practicesessionid");
        return ResponseEntity.status(200).body(pService.editPracticeDetails(field, practice, practiceSessionId));
    }
}
