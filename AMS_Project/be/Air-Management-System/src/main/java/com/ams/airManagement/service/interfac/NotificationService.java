package com.ams.airManagement.service.interfac;

public interface NotificationService {
    void sendPaymentConfirmation(String to, String subject, String body, boolean isHTML);
}