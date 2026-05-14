package com.docappts.PracticeMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PracticeMS.entity.PracticeSession;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, String> {
    
}
