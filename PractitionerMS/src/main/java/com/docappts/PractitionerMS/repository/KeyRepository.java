package com.docappts.PractitionerMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PractitionerMS.entity.ApiKey;

public interface KeyRepository extends JpaRepository<ApiKey, String> {
    
}
