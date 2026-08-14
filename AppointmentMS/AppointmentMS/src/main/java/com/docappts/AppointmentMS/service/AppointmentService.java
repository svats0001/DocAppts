package com.docappts.AppointmentMS.service;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.sql.Time;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.docappts.AppointmentMS.dto.AppointmentDTO;
import com.docappts.AppointmentMS.dto.AppointmentHistoryDTO;
import com.docappts.AppointmentMS.dto.AvailableAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentPracticePractitionerDTO;
import com.docappts.AppointmentMS.dto.BookedAppointmentPracticesDTO;
import com.docappts.AppointmentMS.dto.BookingMfaCodeDTO;
import com.docappts.AppointmentMS.dto.CardDTO;
import com.docappts.AppointmentMS.dto.PaymentDTO;
import com.docappts.AppointmentMS.dto.PracticeDTO;
import com.docappts.AppointmentMS.dto.PractitionerDTO;
import com.docappts.AppointmentMS.dto.UserAppointmentDTO;
import com.docappts.AppointmentMS.dto.UserDTO;
import com.docappts.AppointmentMS.entity.Appointment;
import com.docappts.AppointmentMS.entity.AvailableAppointment;
import com.docappts.AppointmentMS.entity.BookedAppointment;
import com.docappts.AppointmentMS.entity.BookingMfaCode;
import com.docappts.AppointmentMS.enums.Billing;
import com.docappts.AppointmentMS.repository.AppointmentRepository;
import com.docappts.AppointmentMS.repository.AvailableAppointmentRepository;
import com.docappts.AppointmentMS.repository.BookedAppointmentRepository;
import com.docappts.AppointmentMS.repository.BookingMfaCodeRepository;

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

    @Autowired
    BookingMfaCodeRepository mfaRepo;

    public AppointmentDTO getAppointmentByPracticeIdAndPractitionerId(int practiceId, int practitionerId) throws Exception {
        List<Appointment> appointmentsList = ar.findByPracticeIdAndAvailableAppointments_PractitionerId(practiceId, practitionerId);
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
        try {
        List<Appointment> appointmentsList = ar.findByPracticeIdAndAvailableAppointments_PractitionerId(practiceId, practitionerId);
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
                        avRepo.delete(av);
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
                    BookedAppointment newBookedAppt = new BookedAppointment(deletedAppt.getDate(), deletedAppt.getStartTime(), deletedAppt.getEndTime(), appt.getUserId(), appt.getPractitionerId());
                    newBookedAppt.setPaymentId(possiblePayment);
                    BookedAppointment bookedWithId = bookedRepo.saveAndFlush(newBookedAppt);
                    a.getBookedAppointments().add(bookedWithId);
                    ar.saveAndFlush(a);
                    Optional<BookingMfaCode> bmcOptional = mfaRepo.findByUserIdAndActiveAndAvailableAppointmentId(appt.getUserId(), true, deletedAppt.getId());
                    if (bmcOptional.isPresent()) {
                        BookingMfaCode bmc = bmcOptional.get();
                        bmc.setActive(false);
                        mfaRepo.saveAndFlush(bmc);
                        System.out.println("Inside bmc");
                    }
                    return "Successfully booked appointment";
                } else {
                    return "Appointment has already been booked";
                }
            } else {
                return "Appointment has already been booked";
            }
        } catch (ConcurrencyFailureException | UnexpectedRollbackException exc) {
            throw new ConcurrencyFailureException("Appointment already booked");
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
                if (appt.getPractitionerId() == practitioner.getId()) {
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
            AvailableAppointment newAvAppt = new AvailableAppointment(bookedAppt.getDate(), bookedAppt.getStartTime(), bookedAppt.getEndTime(), bookedAppt.getPractitionerId(), UUID.randomUUID().toString());
            avRepo.saveAndFlush(newAvAppt);
            appt.getAvailableAppointments().add(newAvAppt);
            ar.saveAndFlush(appt);
            bookedRepo.delete(bookedAppt);
            return "Successfully cancelled appointment";
        } else {
            return "Unable to find appointment";
        }
    }

    public List<BookedAppointmentPracticesDTO> getBookedAppointmentsByPracticeId(int practiceId, String practiceSessionId) throws Exception {
        List<Appointment> appointments = ar.findByPracticeId(practiceId);
        List<BookedAppointmentPracticesDTO> result = new ArrayList<BookedAppointmentPracticesDTO>();
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String sessionResult = restTemplate.exchange("https://PracticeMS/practices/session/"+practiceSessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!sessionResult.equals("Session updated")) {
            throw new Exception("Session invalid");
        }
        for (Appointment a : appointments) {
            List<BookedAppointment> bookedAppointments = a.getBookedAppointments();
            for (BookedAppointment b: bookedAppointments) {
                PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/"+b.getPractitionerId()+"/"+practiceId,
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
                BookedAppointmentPracticesDTO bp = new BookedAppointmentPracticesDTO();
                bp.setId(b.getId());
                bp.setDate(b.getDate());
                bp.setStartTime(b.getStartTime());
                bp.setEndTime(b.getEndTime());
                bp.setPractitionerName(practitioner.getFirstName() + " " + practitioner.getLastName());
                UserDTO user = restTemplate.exchange("https://UserMS/practice/"+b.getUserId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), UserDTO.class).getBody();
                bp.setUserName(user.getFirstName() + " " + user.getLastName());
                result.add(bp);
                System.out.println(bp.getUserName());
            }
        }
        return result;
    }

    public String createMfa(BookingMfaCodeDTO bmcd, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String res = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        if (bmcd.getAvailableAppointmentId() == -1) {
            throw new Exception("Invalid appointment");
        }
        List<BookingMfaCode> existingCodes = mfaRepo.findByUserIdAndAvailableAppointmentId(bmcd.getUserId(), bmcd.getAvailableAppointmentId());
        if (existingCodes.size() >= 5) {
            return "Too many codes requested in short period of time";
        }
        for (int i = (existingCodes.size() - 1); i >= 0; ) {
            existingCodes.get(i).setActive(false);
            break;
        }
        BookingMfaCode bmc = new BookingMfaCode();
        bmc.setMfaCode(bmcd.getMfaCode());
        bmc.setUserId(bmcd.getUserId());
        bmc.setAvailableAppointmentId(bmcd.getAvailableAppointmentId());
        bmc.setCreated(LocalDateTime.now());
        bmc.setActive(true);
        mfaRepo.saveAndFlush(bmc);
        mfaRepo.saveAllAndFlush(existingCodes);
        return "Successfully created MFA code";
    }

    public String checkCode(BookingMfaCodeDTO bmcd, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String res = restTemplate.exchange("https://UserMS/"+sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        Optional<BookingMfaCode> mfaOptional = mfaRepo.findByUserIdAndActiveAndAvailableAppointmentId(bmcd.getUserId(), true, bmcd.getAvailableAppointmentId());
        if (mfaOptional.isPresent()) {
            BookingMfaCode bmc = mfaOptional.get();
            if (bmc.getMfaCode().equals(bmcd.getMfaCode())) {
                return "Code matches";
            } else {
                return "Code doesn't match";
            }
        }
        return "No MFA code exists";
    }

    public AvailableAppointmentDTO getAvailableAppointmentByDateAndTime(Date date, Time startTime, Time endTime, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        System.out.println("sessionId=" + sessionId);
        String res = restTemplate.exchange("https://UserMS/" + sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        List<AvailableAppointment> avAppt = avRepo.findByDateAndStartTimeAndEndTime(date, startTime, endTime);
        if (avAppt.size() == 0) {
            throw new Exception("No available appointment found");
        } else {
            return AvailableAppointment.convertAvailableAppointment(avAppt.get(0));
        }
    }

    public AvailableAppointmentDTO getAvailableAppointmentByPublicId(String publicId, String sessionId) throws Exception {
        /*String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        System.out.println("sessionId=" + sessionId);
        String res = restTemplate.exchange("https://UserMS/" + sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }*/
        Optional<AvailableAppointment> avAppt = avRepo.findByPublicId(publicId);
        if (!avAppt.isPresent()) {
            throw new Exception("No available appointment found");
        } else {
            return AvailableAppointment.convertAvailableAppointment(avAppt.get());
        }
    }

    public AppointmentHistoryDTO getBookedAppointmentsByUserIdAndDate(int userId, Date date, String sessionId) throws Exception {
        String requestKey = decryptApiKey();
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("X-API-KEY", requestKey);
        String res = restTemplate.exchange("https://UserMS/" + sessionId,
                HttpMethod.GET, new HttpEntity<Object>(headers), String.class).getBody();
        if (!res.equals("Session updated")) {
            throw new Exception(res);
        }
        List<BookedAppointmentPracticePractitionerDTO> bookedDto = new ArrayList<BookedAppointmentPracticePractitionerDTO>();
        LocalDate date2 = date.toLocalDate();
        List<BookedAppointment> booked = bookedRepo.findByUserIdAndDateLessThanEqual(userId, date);
        ZonedDateTime zonedDateTime = ZonedDateTime.of(date2.getYear(), date2.getMonthValue(), date2.getDayOfMonth(), 0, 0, 0, 0, ZoneId.systemDefault());
        long zonedDateTimeMillis = zonedDateTime.toInstant().toEpochMilli();
        Map<Integer, Integer> practiceMap = new HashMap<Integer, Integer>();
        Map<Integer, List<Integer>> practitionerMap = new HashMap<Integer, List<Integer>>();
        AppointmentHistoryDTO history = new AppointmentHistoryDTO();
        for (BookedAppointment appt : booked) {
            if (appt.getDate() == date) {
                LocalTime time2 = appt.getEndTime().toLocalTime();
                long apptTimeMillis = zonedDateTimeMillis + (time2.getHour() * 60 * 60 * 1000) + (time2.getMinute() * 60 * 1000);
                if (apptTimeMillis > System.currentTimeMillis()) {
                    break;
                }
            }
            BookedAppointmentPracticePractitionerDTO bappd = BookedAppointment.convertBookedAppointmentPracticesPractitioner(appt);
            Appointment a = ar.getByBookedAppointmentId(bappd.getId());
            PracticeDTO practice = restTemplate.exchange("https://PracticeMS/practices/" + a.getPracticeId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), PracticeDTO.class).getBody();
            bappd.setPracticeName(practice.getName());
            PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/id/" + appt.getPractitionerId(),
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
            bappd.setPractitionerName(practitioner.getFirstName() + " " + practitioner.getLastName());
            bookedDto.add(bappd);
            if (practiceMap.get(practice.getId()) != null) {
                practiceMap.put(practice.getId(), practice.getId()+1);
            } else {
                practiceMap.put(practice.getId(), 1);
            }
            if (practitionerMap.get(practice.getId()) != null) {
                practitionerMap.get(practice.getId()).add(practitioner.getId());
            } else {
                System.out.println("Inside practitioner map");
                practitionerMap.put(practice.getId(), new ArrayList<Integer>(Arrays.asList(practitioner.getId())));
            }
        }
        int maxVal = 0;
        int practiceVal = -1;
        for (Map.Entry<Integer, Integer> entry : practiceMap.entrySet()) {
            int entryVal = entry.getValue();
            if (entryVal > maxVal) {
                maxVal = entryVal;
                practiceVal = entry.getKey();
            }
            System.out.println("Practice key: " + entry.getKey() + ", practice value: " + entry.getValue());
        }
        for (Map.Entry<Integer, List<Integer>> entry : practitionerMap.entrySet()) {
            System.out.println("Practice key: " + entry.getKey() + ", practice value: " + entry.getValue().size());
        }
        if (practiceVal != -1) {
            List<Integer> practitionerIds = practitionerMap.get(practiceVal);
            System.out.println(practitionerIds.size());
            Collections.sort(practitionerIds);
            int practitionerVal = practitionerIds.size() > 0 ? practitionerIds.get(0) : -1;
            int maxCount = 1;
            int count = 1;
            for (int i = 0; i < (practitionerIds.size()-1); i++) {
                if (practitionerIds.get(i) == practitionerIds.get(i+1)) {
                    count++;
                }
                if (count > maxCount) {
                    practitionerVal = practitionerIds.get(i);
                    maxCount = count;
                }
                if (practitionerIds.get(i) != practitionerIds.get(i+1)) {
                    count = 1;
                }
            }
            System.out.println(practitionerVal);
            PracticeDTO practice = restTemplate.exchange("https://PracticeMS/practices/" + practiceVal,
                HttpMethod.GET, new HttpEntity<Object>(headers), PracticeDTO.class).getBody();
            history.setMostVisitedPractice(practice);
            if (practitionerVal != -1) {
                PractitionerDTO practitioner = restTemplate.exchange("https://PractitionerMS/id/" + practitionerVal,
                HttpMethod.GET, new HttpEntity<Object>(headers), PractitionerDTO.class).getBody();
                history.setMostVisitedPractitioner(practitioner);
            }
        }
        history.setAppointments(bookedDto);
        return history;
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
