package com.docappts.AppointmentMS;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.docappts.AppointmentMS.security.SSLUtils;

@Configuration
public class AppointmentConfiguration {
    
    @LoadBalanced
    @Bean
    RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException {
        SSLUtils.turnOffSslChecking();
        return new RestTemplate();
    }
    
}
