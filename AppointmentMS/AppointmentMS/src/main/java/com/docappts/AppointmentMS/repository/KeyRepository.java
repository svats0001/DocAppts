package com.docappts.AppointmentMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.AppointmentMS.entity.ApiKey;

public interface KeyRepository extends JpaRepository<ApiKey, String> {
    
}
