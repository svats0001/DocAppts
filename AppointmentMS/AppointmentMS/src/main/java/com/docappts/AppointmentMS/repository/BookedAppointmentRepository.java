package com.docappts.AppointmentMS.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.AppointmentMS.entity.BookedAppointment;

public interface BookedAppointmentRepository extends JpaRepository<BookedAppointment, Integer> {
    List<BookedAppointment> findByUserId(int userId);
}
