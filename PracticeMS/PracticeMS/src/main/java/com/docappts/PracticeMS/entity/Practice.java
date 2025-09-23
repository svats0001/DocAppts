package com.docappts.PracticeMS.entity;

import java.util.List;

import com.docappts.PracticeMS.DTO.PracticeDTO;
import com.docappts.PracticeMS.DTO.PractitionerDTO;
import com.docappts.PracticeMS.enums.Specialty;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Practice {
    
    @Id
    private int id;

    private String name;

    private String address;

    private String phone;

    private String description;

    private String thumbnailPath;

    @ElementCollection
    private List<Integer> practitioners;

    private Specialty specialty;

    public Practice() {

    }

    public Practice(int id, String name, String address, String phone, String description,
    String thumbnailPath, Specialty specialty) {
        this.id = id;
        this.address = address;
        this.name = name;
        this.phone = phone;
        this.thumbnailPath = thumbnailPath;
        this.description = description;
        this.specialty = specialty;
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

    public List<Integer> getPractitioners() {
        return practitioners;
    }

    public void setPractitioners(List<Integer> practitioners) {
        this.practitioners = practitioners;
    }

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setSpecialty(Specialty specialty) {
        this.specialty = specialty;
    }

    public static PracticeDTO generatePracticeDTO(Practice p) {
        PracticeDTO pDTO = new PracticeDTO();
        
        pDTO.setAddress(p.getAddress());
        pDTO.setDescription(p.getDescription());
        pDTO.setId(p.getId());
        pDTO.setName(p.getName());
        pDTO.setPhone(p.getPhone());
        pDTO.setThumbnailPath(p.getThumbnailPath());
        pDTO.setSpecialty(p.getSpecialty());
        
        return pDTO;
    }
}
