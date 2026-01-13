package com.docappts.UserMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.UserMS.entity.UserSession;

public interface SessionRepository extends JpaRepository<UserSession, String> {
    
}
