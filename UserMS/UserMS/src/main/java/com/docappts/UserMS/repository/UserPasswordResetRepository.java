package com.docappts.UserMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.UserMS.entity.UserPasswordReset;

public interface UserPasswordResetRepository extends JpaRepository<UserPasswordReset, String> {
    
    void deleteAllByUserId(int userId);

    
}
