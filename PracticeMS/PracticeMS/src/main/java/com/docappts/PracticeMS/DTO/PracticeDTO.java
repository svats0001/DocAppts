package com.docappts.PracticeMS.DTO;

import java.util.List;

import com.docappts.PracticeMS.entity.Practice;
import com.docappts.PracticeMS.enums.Specialty;

public class PracticeDTO {
    
    private int id;

    private String name;

    private String address;

    private String phone;

    private String description;

    private String thumbnailPath;

    private List<PractitionerDTO> practitioners;

    private Specialty specialty;

    public PracticeDTO() {
        
    }

    public PracticeDTO(int id, String name, String address, String phone, String description,
    String thumbnailPath) {
        this.id = id;
        this.address = address;
        this.name = name;
        this.phone = phone;
        this.thumbnailPath = thumbnailPath;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnailPath() {
        return thumbnailPath;
    }

    public void setThumbnailPath(String thumbnailPath) {
        this.thumbnailPath = thumbnailPath;
    }

    public List<PractitionerDTO> getPractitioners() {
        return practitioners;
    }

    public void setPractitioners(List<PractitionerDTO> practitioners) {
        this.practitioners = practitioners;
    } 

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setSpecialty(Specialty specialty) {
        this.specialty = specialty;
    }

    public static Practice generatePractice(PracticeDTO pDTO) {
        Practice p = new Practice();
        
        p.setAddress(pDTO.getAddress());
        p.setDescription(pDTO.getDescription());
        p.setId(pDTO.getId());
        p.setName(pDTO.getName());
        p.setPhone(pDTO.getPhone());
        p.setThumbnailPath(pDTO.getThumbnailPath());
        p.setSpecialty(pDTO.getSpecialty());
        
        return p;
    }
}
