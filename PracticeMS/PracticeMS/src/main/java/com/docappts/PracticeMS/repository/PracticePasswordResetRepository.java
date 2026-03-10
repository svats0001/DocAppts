package com.docappts.PracticeMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PracticeMS.entity.PracticePasswordReset;

public interface PracticePasswordResetRepository extends JpaRepository<PracticePasswordReset, String> {
    
    void deleteAllByPracticeId(int practiceId);

    
}
