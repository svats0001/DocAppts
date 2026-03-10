package com.docappts.PractitionerMS.service;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;
import java.security.InvalidKeyException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.docappts.PractitionerMS.dto.AppointmentDTO;
import com.docappts.PractitionerMS.dto.PractitionerDTO;
import com.docappts.PractitionerMS.entity.Practitioner;
import com.docappts.PractitionerMS.repository.PractitionerRepository;

@Service
public class PractitionerService {
    
    @Autowired
    PractitionerRepository pRepository;

    @Autowired
    RestTemplate restTemplate;

    @Value("${microservice.intercommunication}")
    String apiKey;

    @Value("${encryption.key}")
    String secretKey;

    public PractitionerDTO getPractitionerByEmailAndMobile(String email, String mobile) throws Exception {
        Optional<Practitioner> pOptional = pRepository.findByEmailAndMobile(email, mobile);
        if (pOptional.isPresent()) {
            return Practitioner.convertPractitioner(pOptional.get());
        }
        throw new Exception("Practitioner not found");
    }

    public PractitionerDTO getPractitionerById(int id, int practiceId) throws Exception {
        Optional<Practitioner> pOptional = pRepository.findById(id);
        if (pOptional.isPresent()) {
            PractitionerDTO pd = Practitioner.convertPractitioner(pOptional.get());
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            String requestKey = decryptApiKey();
            headers.add("X-API-KEY", requestKey);
            AppointmentDTO appt = restTemplate.exchange("https://AppointmentMS/"+practiceId+"/"+id, HttpMethod.GET,
            new HttpEntity<Object>(headers), AppointmentDTO.class).getBody();
            pd.setAppointments(appt);
            return pd;
        } throw new Exception("Practitioner not found");
    }

    public String decryptApiKey() throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        String algorithm = "AES";
        String transformation = "AES/ECB/PKCS5Padding";
        
        byte[] decodedKey = Base64.getDecoder().decode(secretKey);
        SecretKey originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
        
        // Step 3: Initialize a cipher object with the key and decryption mode
        Cipher cipher = Cipher.getInstance(transformation);
        cipher.init(Cipher.DECRYPT_MODE, originalKey);
        
        // Step 4: Decrypt the data using the cipher object
        String encryptedBase64 = apiKey; // The encrypted data from the encryption example
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedBase64);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        String decryptedText = new String(decryptedBytes, StandardCharsets.UTF_8);

        return decryptedText;
    }
}
