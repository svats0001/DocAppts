package com.docappts.AppointmentMS.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.AppointmentMS.entity.BookingMfaCode;

public interface BookingMfaCodeRepository extends JpaRepository<BookingMfaCode, String> {
    List<BookingMfaCode> findByUserId(int userId);

    Optional<BookingMfaCode> findByUserIdAndActive(int userId, boolean active);
}
