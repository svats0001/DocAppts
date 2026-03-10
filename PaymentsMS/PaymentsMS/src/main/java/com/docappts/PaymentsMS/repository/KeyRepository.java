package com.docappts.PaymentsMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PaymentsMS.entity.ApiKey;

public interface KeyRepository extends JpaRepository<ApiKey, String> {
    
}
