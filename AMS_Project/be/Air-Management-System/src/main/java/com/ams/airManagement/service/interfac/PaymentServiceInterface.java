package com.ams.airManagement.service.interfac;

import com.ams.airManagement.dto.PaymentDTO;
import com.ams.airManagement.dto.ResponseDTO;

public interface PaymentServiceInterface {
    ResponseDTO makePayment(PaymentDTO paymentDTO);
}
