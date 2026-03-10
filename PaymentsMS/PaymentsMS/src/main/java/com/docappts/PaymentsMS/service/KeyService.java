package com.docappts.PaymentsMS.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.docappts.PaymentsMS.entity.ApiKey;
import com.docappts.PaymentsMS.repository.KeyRepository;

@Service
public class KeyService {
    
    @Autowired
    KeyRepository keyRepository;

    public String getApiToken(String microservice) {
        Optional<ApiKey> ak = keyRepository.findById(microservice);
        if (ak.isPresent()) {
            return ak.get().getApiKey();
        } else {
            throw new BadCredentialsException("Invalid microservice");
        }
    }
}
