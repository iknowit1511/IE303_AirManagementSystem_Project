package com.ams.airManagement.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private int bookingId;
    private double amount;
    private String method;
}
