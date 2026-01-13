package com.docappts.AppointmentMS.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.docappts.AppointmentMS.dto.AppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;
import com.docappts.AppointmentMS.dto.UserAppointmentDTO;
import com.docappts.AppointmentMS.service.AppointmentService;

@RestController
public class AppointmentController {
    
    @Autowired
    AppointmentService as;

    @GetMapping("/{practiceId}/{practitionerId}")
    public ResponseEntity<AppointmentDTO> getAppointmentByPracticeIdAndPractitionerId(@PathVariable("practiceId") int practiceId,
    @PathVariable("practitionerId") int practitionerId) throws Exception {
        return ResponseEntity.status(200).body(as.getAppointmentByPracticeIdAndPractitionerId(practiceId, practitionerId));
    }

    @PostMapping("/{practiceId}/{practitionerId}")
    public ResponseEntity<String> bookAppointment(@PathVariable("practiceId") int practiceId, @PathVariable("practitionerId") int practitionerId, @RequestBody BookedAppointmentDTO appt, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        String result = as.bookAppointment(appt, practiceId, practitionerId, sessionId, appt.getCard());
        return ResponseEntity.status(200).body(result);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserAppointmentDTO>> getUserAppointments(@PathVariable("userId") int userId, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(as.getUserAppointments(userId, sessionId));
    }

    @GetMapping("cancel/{bookedAppointmentId}/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable("bookedAppointmentId") int bookedAppointmentId, @PathVariable("appointmentId") int appointmentId, @RequestHeader Map<String,String> headers) throws Exception {
        String sessionId = headers.get("sessionid");
        return ResponseEntity.status(200).body(as.cancelAppointment(bookedAppointmentId, appointmentId, sessionId));
    }
}
