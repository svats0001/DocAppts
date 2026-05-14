package com.docappts.PracticeMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PracticeMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PracticeMsApplication.class, args);
	}

}
