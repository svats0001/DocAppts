package com.docappts.PractitionerMS;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.docappts.PractitionerMS.security.SSLUtils;

@Configuration
public class PractitionerConfiguration {
    
    @LoadBalanced
    @Bean
    RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException {
        SSLUtils.turnOffSslChecking();
        return new RestTemplate();
    }
}
