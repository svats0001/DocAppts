package com.docappts.PaymentsMS;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.docappts.PaymentsMS.security.SSLUtils;

@Configuration
public class PaymentsConfiguration {
    
    @Bean
    @LoadBalanced
    RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException {
        SSLUtils.turnOffSslChecking();
        return new RestTemplate();
    }
    
}
