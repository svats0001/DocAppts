package com.docappts.PaymentsMS.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ApiKey {
    
    @Id
    private String microservice;

    private String apiKey;

    public ApiKey() {

    };

    public String getMicroservice() {
        return microservice;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setMicroservice(String microservice) {
        this.microservice = microservice;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
