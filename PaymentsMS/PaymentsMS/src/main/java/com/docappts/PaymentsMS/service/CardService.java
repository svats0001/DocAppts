package com.docappts.PaymentsMS.service;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

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

import com.docappts.PaymentsMS.dto.CardDTO;
import com.docappts.PaymentsMS.entity.Card;
import com.docappts.PaymentsMS.repository.CardRepository;

@Service
public class CardService {

    @Autowired
    CardRepository cardRepository;
    
    @Autowired
    RestTemplate restTemplate;

    @Value("${microservice.intercommunication}")
    String apiKey;

    @Value("${encryption.key}")
    String secretKey;

    public boolean checkSession(String sessionId) throws Exception {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        String requestKey = decryptApiKey();
        headers.add("X-API-KEY", requestKey);
        String result = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!result.equals("Session updated")) {
            throw new Exception(result);
        }
        return true;
    }

    public Integer createCard(CardDTO card, String sessionId) throws Exception {
        if (checkSession(sessionId)) {
            card.setToken(UUID.randomUUID().toString());
            return cardRepository.saveAndFlush(CardDTO.convertCardDTO(card)).getId();
        }
        return -1;
    }

    public CardDTO getCard(int userId, String sessionId) throws Exception {
        if (checkSession(sessionId)) {
            Optional<Card> cOptional = cardRepository.findByUserId(userId);
            if (cOptional.isPresent()) {
                return Card.convertCard(cOptional.get());
            } else {
                throw new Exception("Card does not exist for user");
            }
        }
        return null;
    }

    public String deleteCard(int id, String sessionId) throws Exception {
        if (checkSession(sessionId)) {
            cardRepository.deleteById(id);
            return "Successfully deleted card";
        }
        return "Delete card failed";
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
