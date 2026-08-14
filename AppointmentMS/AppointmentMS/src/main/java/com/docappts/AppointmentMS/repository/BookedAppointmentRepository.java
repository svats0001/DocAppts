package com.docappts.AppointmentMS.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.docappts.AppointmentMS.entity.BookedAppointment;

public interface BookedAppointmentRepository extends JpaRepository<BookedAppointment, Integer> {
    List<BookedAppointment> findByUserId(int userId);

    @Query("select b from BookedAppointment b where b.userId=?1 and b.date <= ?2 order by b.date desc")
    List<BookedAppointment> findByUserIdAndDateLessThanEqual(int userId, Date date);
}
