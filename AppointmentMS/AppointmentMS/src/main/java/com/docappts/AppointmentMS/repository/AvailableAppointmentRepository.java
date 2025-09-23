package com.docappts.AppointmentMS.repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.docappts.AppointmentMS.entity.AvailableAppointment;

public interface AvailableAppointmentRepository extends JpaRepository<AvailableAppointment, Integer> {
    @Query(value="select a from AvailableAppointment a where a.date=?1 and a.startTime=?2")
    List<AvailableAppointment> getByDateAndStartTime(Date date, Time startTime);

    List<AvailableAppointment> findByDateAndStartTimeAndEndTime(Date date, Time startTime, Time endTime);
}
