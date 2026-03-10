package com.docappts.PractitionerMS.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

public class AppointmentDTO {
    
    private int id;

    private int practitionerId;

    private int practiceId;

    private List<AvailableAppointmentDTO> availableAppointmentsDTO;

    private List<BookedAppointmentDTO> bookedAppointmentsDTO;

    public AppointmentDTO() {

    }

    public AppointmentDTO(int id, int practitionerId, int practiceId, List<AvailableAppointmentDTO> availableAppointmentsDTO,
    List<BookedAppointmentDTO> bookedAppointmentsDTO) {
        this.practitionerId = practitionerId;
        this.practiceId = practiceId;
        this.availableAppointmentsDTO = availableAppointmentsDTO;
        this.bookedAppointmentsDTO = bookedAppointmentsDTO;
        this.id = id;
    }

    public int getPractitionerId() {
        return practitionerId;
    }

    public void setPractitionerId(int practitionerId) {
        this.practitionerId = practitionerId;
    }

    public int getPracticeId() {
        return practiceId;
    }

    public void setPracticeId(int practiceId) {
        this.practiceId = practiceId;
    }

    public List<AvailableAppointmentDTO> getAvailableAppointmentsDTO() {
        return availableAppointmentsDTO;
    }

    public void setAvailableAppointmentsDTO(List<AvailableAppointmentDTO> availableAppointmentsDTO) {
        this.availableAppointmentsDTO = availableAppointmentsDTO;
    }

    public List<BookedAppointmentDTO> getBookedAppointmentsDTO() {
        return bookedAppointmentsDTO;
    }

    public void setBookedAppointmentsDTO(List<BookedAppointmentDTO> bookedAppointmentsDTO) {
        this.bookedAppointmentsDTO = bookedAppointmentsDTO;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
