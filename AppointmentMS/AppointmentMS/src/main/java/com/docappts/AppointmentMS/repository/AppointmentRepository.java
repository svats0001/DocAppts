package com.docappts.AppointmentMS.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.docappts.AppointmentMS.entity.Appointment;
import com.docappts.AppointmentMS.entity.AvailableAppointment;
import com.docappts.AppointmentMS.entity.BookedAppointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPracticeIdAndPractitionerId(int practiceId, int practitionerId);

    List<Appointment> findByPracticeId(int practiceId);

    @Query(value = "from Appointment a join a.bookedAppointments b where b.id = :bookedAppointmentId")
    Appointment getByBookedAppointmentId(int bookedAppointmentId);
}
