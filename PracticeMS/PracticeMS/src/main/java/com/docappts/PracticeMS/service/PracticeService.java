package com.docappts.PracticeMS.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.docappts.PracticeMS.DTO.PracticeDTO;
import com.docappts.PracticeMS.DTO.PractitionerDTO;
import com.docappts.PracticeMS.entity.Practice;
import com.docappts.PracticeMS.repository.PracticeRepository;

import jakarta.transaction.Transactional;

@Service
@PropertySource("classpath:application.properties")
public class PracticeService {
    
    @Autowired
    PracticeRepository pRepository;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    SessionService sessionService;

    @Autowired
    PracticePasswordResetService pprService;

    @Value("${microservice.intercommunication}")
    String apiKey;

    @Value("${encryption.key}")
    String secretKey;

    public PracticeDTO createPractice(PracticeDTO pDTO) throws Exception {
        Optional<Practice> pOptional = pRepository.findByEmail(pDTO.getEmail());
        if (pOptional.isPresent()) {
            throw new Exception("Practice with this email already exists");
        }
        String salt = BCrypt.gensalt(12);
        pDTO.setPassword(BCrypt.hashpw(pDTO.getPassword(), salt));
        PracticeDTO created = Practice.generatePracticeDTO(pRepository.saveAndFlush(PracticeDTO.generatePractice(pDTO)));
        System.out.println(created);
        return created;
    }

    public PracticeDTO checkPracticeLogin(PracticeDTO pDTO) throws Exception {
        Optional<Practice> pOptional = pRepository.findByEmail(pDTO.getEmail());
        if (pOptional.isPresent()) {
            Practice p = pOptional.get();
            if (BCrypt.checkpw(pDTO.getPassword(), p.getPassword())) {
                PracticeDTO pd = new PracticeDTO();
                pd = Practice.generatePracticeDTO(p);
                pd.setPassword("");
                return pd;
            }
        }
        throw new Exception("Invalid login details");
    }

    public List<PracticeDTO> getPractices() {
        System.out.println(System.currentTimeMillis());
        List<Practice> practices = pRepository.findAll();
        List<PracticeDTO> practicesDTO = new ArrayList<PracticeDTO>();
        for (Practice p : practices) {
            practicesDTO.add(Practice.generatePracticeDTO(p));
        }
        System.out.println(System.currentTimeMillis());
        return practicesDTO;
    }

    public PracticeDTO getPracticeById(int id) throws Exception {
        Optional<Practice> pOptional = pRepository.findById(id);
        if (pOptional.isPresent()) {
            Practice p = pOptional.get();
            List<PractitionerDTO> practitioners = new ArrayList<PractitionerDTO>();
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            String requestKey = decryptApiKey();
            headers.add("X-API-KEY", requestKey);
            for (int practitionerId : p.getPractitioners()) {
                PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/"+practitionerId+"/"+p.getId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
                practitioners.add(practitioner);
            }
            PracticeDTO pDTO = Practice.generatePracticeDTO(p);
            pDTO.setPractitioners(practitioners);
            return pDTO;
        } else {
            throw new Exception("Practice not found");
        }
    }

    public PracticeDTO getPracticeByNameAndPhone(String name, String phone) throws Exception {
        List<Practice> pList = pRepository.findByNameAndPhone(name, phone);
        if (pList.size() > 0) {
            Practice p = pList.get(0);
            List<PractitionerDTO> practitioners = new ArrayList<PractitionerDTO>();
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            String requestKey = decryptApiKey();
            headers.add("X-API-KEY", requestKey);
            for (int practitionerId : p.getPractitioners()) {
                PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/"+practitionerId+"/"+p.getId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
                practitioners.add(practitioner);
            }
            PracticeDTO pDTO = Practice.generatePracticeDTO(p);
            pDTO.setPractitioners(practitioners);
            return pDTO;
        } else {
            throw new Exception("Practice not found");
        }
    }

    @Transactional
    public String editPracticeDetails(String field, PracticeDTO practice, String practiceSessionId) {
        if (field.equals("password") || sessionService.pollSession(practiceSessionId).equals("Session updated")) {
            Optional<Practice> pOptional = pRepository.findById(practice.getId());
            if (pOptional.isPresent()) {
                Practice p = pOptional.get();
                switch (field) {
                    case "password":
                        String salt = BCrypt.gensalt(12);
                        p.setPassword(BCrypt.hashpw(practice.getPassword(), salt));
                        break;
                    default:
                }
                pRepository.saveAndFlush(p);
                pprService.deletePracticePasswordReset(p.getId());
                return "Field updated";
            }
            return "Practice not found";
        }
        return "Session doesn't exist";
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
