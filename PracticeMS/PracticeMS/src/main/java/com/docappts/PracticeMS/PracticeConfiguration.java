package com.docappts.PracticeMS;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.docappts.PracticeMS.security.SSLUtils;

@Configuration
public class PracticeConfiguration {
    
    @LoadBalanced
    @Bean
    RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException {
        SSLUtils.turnOffSslChecking();
        return new RestTemplate();
    }
}
