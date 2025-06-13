// com.ams.airManagement.controller.PaymentController.java
package com.ams.airManagement.controller;

import com.ams.airManagement.dto.PaymentDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.service.interfac.PaymentServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentServiceInterface paymentService;

    @PostMapping("/make")
    public ResponseEntity<ResponseDTO> makePayment(@RequestBody PaymentDTO paymentDTO) {
        ResponseDTO response = paymentService.makePayment(paymentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
