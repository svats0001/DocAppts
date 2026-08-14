package com.docappts.UserMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.UserMS.entity.ApiKey;

public interface KeyRepository extends JpaRepository<ApiKey, String> {
    
}
