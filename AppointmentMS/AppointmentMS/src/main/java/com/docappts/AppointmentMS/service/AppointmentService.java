package com.docappts.AppointmentMS.service;

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
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.docappts.AppointmentMS.dto.AppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;
import com.docappts.AppointmentMS.dto.CardDTO;
import com.docappts.AppointmentMS.dto.PaymentDTO;
import com.docappts.AppointmentMS.dto.PracticeDTO;
import com.docappts.AppointmentMS.dto.PractitionerDTO;
import com.docappts.AppointmentMS.dto.UserAppointmentDTO;
import com.docappts.AppointmentMS.entity.Appointment;
import com.docappts.AppointmentMS.entity.AvailableAppointment;
import com.docappts.AppointmentMS.entity.BookedAppointment;
import com.docappts.AppointmentMS.enums.Billing;
import com.docappts.AppointmentMS.repository.AppointmentRepository;
import com.docappts.AppointmentMS.repository.AvailableAppointmentRepository;
import com.docappts.AppointmentMS.repository.BookedAppointmentRepository;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;

@Service
@PropertySource("classpath:application.properties")
public class AppointmentService {
    
    @Autowired
    AppointmentRepository ar;

    @Autowired
    RestTemplate restTemplate;

    @Value("${microservice.intercommunication}")
    String apiKey;

    @Value("${encryption.key}")
    String secretKey;

    @Autowired
    AvailableAppointmentRepository avRepo;

    @Autowired
    BookedAppointmentRepository bookedRepo;

    public AppointmentDTO getAppointmentByPracticeIdAndPractitionerId(int practiceId, int practitionerId) throws Exception {
        List<Appointment> appointmentsList = ar.findByPracticeIdAndPractitionerId(practiceId, practitionerId);
        try {
            Appointment a = appointmentsList.get(0);
            System.out.println(a.getAvailableAppointments());
            return Appointment.convertAppointment(a);
        } catch (Exception ex) {
            throw new Exception("No appointments found");
        }
    }

    @Transactional
    public String bookAppointment(BookedAppointmentDTO appt, int practiceId, int practitionerId, String sessionId,
        @Nullable CardDTO card) throws Exception {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        String requestKey = decryptApiKey();
        headers.add("X-API-KEY", requestKey);
        String result = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!result.equals("Session updated")) {
            throw new Exception(result);
        }
        List<Appointment> appointmentsList = ar.findByPracticeIdAndPractitionerId(practiceId, practitionerId);
            Appointment a = appointmentsList.get(0);
            System.out.println(appt.getDate() + ":" + appt.getStartTime());
            List<AvailableAppointment> avApptOptional = avRepo.getByDateAndStartTime(appt.getDate(), appt.getStartTime());
            System.out.println("Inside 1");
            if (avApptOptional.size() > 0) {
                AvailableAppointment avAppt = avApptOptional.get(0);
                Optional<AvailableAppointment> deletedApptOptional = Optional.empty();
                for (int i = 0; i < a.getAvailableAppointments().size(); i++) {
                    AvailableAppointment av = a.getAvailableAppointments().get(i);
                    if (av.getId() == avAppt.getId()) {
                        deletedApptOptional = Optional.of(av);
                        a.getAvailableAppointments().remove(i);
                        break;
                    }
                }
                System.out.println("Inside 2");
                if (deletedApptOptional.isPresent()) {
                    PracticeDTO practice = restTemplate.exchange("https://PracticeMS/practices/"+practiceId,
                HttpMethod.GET, new HttpEntity<Object>(headers), PracticeDTO.class).getBody();
                PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/"+practitionerId+"/"+practiceId,
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
                int possiblePayment = -1;
                if (practice.getBilling() == Billing.NO_BULK_BILLING || (practice.getBilling() == Billing.MIXED && practitioner.getBilled())) {
                    PaymentDTO payment = new PaymentDTO(appt.getUserId(), a.getId(), null, practice.getBillingRate(), card);
                    try {
                        possiblePayment = restTemplate.exchange("https://PaymentsMS/payment",
                HttpMethod.POST, new HttpEntity<PaymentDTO>(payment, headers), Integer.class).getBody();
                    } catch (Exception ex) {
                throw new Exception("Payment failure");
                }}
                AvailableAppointment deletedAppt = deletedApptOptional.get();
                    BookedAppointment newBookedAppt = new BookedAppointment(deletedAppt.getDate(), deletedAppt.getStartTime(), deletedAppt.getEndTime(), appt.getUserId());
                    newBookedAppt.setPaymentId(possiblePayment);
                    BookedAppointment bookedWithId = bookedRepo.saveAndFlush(newBookedAppt);
                    a.getBookedAppointments().add(bookedWithId);
                    ar.saveAndFlush(a);
                    System.out.println("Inside 3");
                    return "Successfully booked appointment";
                } else {
                    return "No appointments found";
                }
            } else {
                return "No appointments found";
            }
    }

    public List<UserAppointmentDTO> getUserAppointments(int userId, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String res = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        List<BookedAppointment> bookedAppointments = bookedRepo.findByUserId(userId);
        List<UserAppointmentDTO> userAppointments = new ArrayList<UserAppointmentDTO>();
        for (BookedAppointment appt: bookedAppointments) {
            UserAppointmentDTO uad = new UserAppointmentDTO();
            uad.setBookedAppointmentId(appt.getId());
            uad.setDate(appt.getDate());
            uad.setEndTime(appt.getEndTime());
            uad.setStartTime(appt.getStartTime());
            Appointment appointment = ar.getByBookedAppointmentId(appt.getId());
            uad.setAppointmentId(appointment.getId());
            PracticeDTO result = restTemplate.exchange("https://PracticeMS/practices/"+appointment.getPracticeId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), PracticeDTO.class).getBody();
            uad.setPracticeName(result.getName());
            for (PractitionerDTO practitioner: result.getPractitioners()) {
                if (appointment.getPractitionerId() == practitioner.getId()) {
                    uad.setPractitionerName(practitioner.getFirstName()+" "+practitioner.getLastName());
                    break;
                }
            }
            userAppointments.add(uad);
        }
        return userAppointments;
    }

    @Transactional
    public String cancelAppointment(int bookedAppointmentId, int appointmentId, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String res = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        Optional<BookedAppointment> bookedApptOptional = bookedRepo.findById(bookedAppointmentId);
        Optional<Appointment> apptOptional = ar.findById(appointmentId);
        if (bookedApptOptional.isPresent() && apptOptional.isPresent()) {
            BookedAppointment bookedAppt = bookedApptOptional.get();
            Appointment appt = apptOptional.get();
            List<BookedAppointment> ba = appt.getBookedAppointments();
            for (int i = 0; i < ba.size(); i++) {
                if (ba.get(i).getId() == bookedAppt.getId()) {
                    if (ba.get(i).getPaymentId() != -1) {
                        boolean cancelledPaymentSuccess = restTemplate.exchange("https://PaymentsMS/payment/"+ba.get(i).getPaymentId(),
                HttpMethod.PUT, new HttpEntity<Object>(headers), Boolean.class).getBody();
                        if (cancelledPaymentSuccess == false) {
                            throw new Exception("Cancel payment failed");
                        }
                    }
                    ba.remove(i);
                    break;
                }
            }
            List<AvailableAppointment> aaList = avRepo.findByDateAndStartTimeAndEndTime(bookedAppt.getDate(), bookedAppt.getStartTime(), bookedAppt.getEndTime());
            if (aaList.size() > 0) {
                AvailableAppointment aa = aaList.get(0);
                appt.getAvailableAppointments().add(aa);
            } else {
                return "Unable to find available appointment";
            }
            bookedRepo.delete(bookedAppt);
            return "Successfully cancelled appointment";
        } else {
            return "Unable to find appointment";
        }
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
