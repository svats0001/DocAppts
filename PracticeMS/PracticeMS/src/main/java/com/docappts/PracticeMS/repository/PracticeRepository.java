package com.docappts.PracticeMS.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.docappts.PracticeMS.entity.Practice;

public interface PracticeRepository extends JpaRepository<Practice, Integer> {
    List<Practice> findByNameAndPhone(String name, String phone);
}
