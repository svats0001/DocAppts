package com.docappts.PaymentsMS.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PaymentsMS.entity.Card;

public interface CardRepository extends JpaRepository<Card, Integer> {
    
    Optional<Card> findByUserId(int userId);
}
