package com.docappts.PractitionerMS.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PractitionerMS.entity.Practitioner;

public interface PractitionerRepository extends JpaRepository<Practitioner, Integer> {
    Optional<Practitioner> findByEmailAndMobile(String email, String mobile);
}
