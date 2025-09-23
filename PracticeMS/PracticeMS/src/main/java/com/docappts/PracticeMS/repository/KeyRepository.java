package com.docappts.PracticeMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PracticeMS.entity.ApiKey;

public interface KeyRepository extends JpaRepository<ApiKey, String> {
    
}
