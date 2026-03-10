package com.docappts.UserMS.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.UserMS.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
