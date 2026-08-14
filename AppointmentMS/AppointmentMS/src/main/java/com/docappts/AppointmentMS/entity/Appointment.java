package com.docappts.AppointmentMS.entity;

import java.util.ArrayList;
import java.util.List;

import com.docappts.AppointmentMS.dto.AppointmentDTO;
import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;

@Entity
public class Appointment {
    
    @Id
    private int id;

    private int practiceId;

    @OneToMany
    @OrderBy("date ASC, startTime ASC")
    private List<AvailableAppointment> availableAppointments;

    @OneToMany
    private List<BookedAppointment> bookedAppointments;

    public Appointment() {

    }

    public Appointment(int id, int practiceId, List<AvailableAppointment> availableAppointments,
    List<BookedAppointment> bookedAppointments) {
        this.practiceId = practiceId;
        this.availableAppointments = availableAppointments;
        this.bookedAppointments = bookedAppointments;
        this.id = id;
    }

    public int getPracticeId() {
        return practiceId;
    }

    public void setPracticeId(int practiceId) {
        this.practiceId = practiceId;
    }

    public List<AvailableAppointment> getAvailableAppointments() {
        return availableAppointments;
    }

    public void setAvailableAppointments(List<AvailableAppointment> availableAppointments) {
        this.availableAppointments = availableAppointments;
    }

    public List<BookedAppointment> getBookedAppointments() {
        return bookedAppointments;
    }

    public void setBookedAppointments(List<BookedAppointment> bookedAppointments) {
        this.bookedAppointments = bookedAppointments;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public static AppointmentDTO convertAppointment(Appointment a) {
        AppointmentDTO ad = new AppointmentDTO();
        ad.setId(a.getId());
        ad.setPracticeId(a.getPracticeId());
        List<AvailableAppointmentDTO> aadList = new ArrayList<AvailableAppointmentDTO>();
        for (AvailableAppointment aa : a.getAvailableAppointments()) {
            aadList.add(AvailableAppointment.convertAvailableAppointment(aa));
        }
        ad.setAvailableAppointmentsDTO(aadList);
        List<BookedAppointmentDTO> badList = new ArrayList<BookedAppointmentDTO>();
        for (BookedAppointment ba : a.getBookedAppointments()) {
            badList.add(BookedAppointment.convertBookedAppointment(ba));
        }
        ad.setBookedAppointmentsDTO(badList);
        return ad;
    }
}
