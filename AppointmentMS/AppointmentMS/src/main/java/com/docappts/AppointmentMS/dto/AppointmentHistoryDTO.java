package com.docappts.AppointmentMS.dto;

import java.util.List;

public class AppointmentHistoryDTO {
    
    List<BookedAppointmentPracticePractitionerDTO> appointments;

    PracticeDTO mostVisitedPractice;

    PractitionerDTO mostVisitedPractitioner;

    public AppointmentHistoryDTO() {

    }

    public AppointmentHistoryDTO(List<BookedAppointmentPracticePractitionerDTO> appointments, PracticeDTO mostVisitedPractice,
        PractitionerDTO mostVisitedPractitioner) {
        this.appointments = appointments;
        this.mostVisitedPractice = mostVisitedPractice;
        this.mostVisitedPractitioner = mostVisitedPractitioner;
    }

    public List<BookedAppointmentPracticePractitionerDTO> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<BookedAppointmentPracticePractitionerDTO> appointments) {
        this.appointments = appointments;
    }

    public PracticeDTO getMostVisitedPractice() {
        return mostVisitedPractice;
    }

    public void setMostVisitedPractice(PracticeDTO mostVisitedPractice) {
        this.mostVisitedPractice = mostVisitedPractice;
    }

    public PractitionerDTO getMostVisitedPractitioner() {
        return mostVisitedPractitioner;
    }

    public void setMostVisitedPractitioner(PractitionerDTO mostVisitedPractitioner) {
        this.mostVisitedPractitioner = mostVisitedPractitioner;
    }

}
