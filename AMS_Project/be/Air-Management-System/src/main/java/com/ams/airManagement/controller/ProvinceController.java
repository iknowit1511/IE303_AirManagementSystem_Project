package com.ams.airManagement.controller;

import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.service.interfac.ProvinceServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/provinces")
public class ProvinceController {

    @Autowired
    private ProvinceServiceInterface provinceService;

    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getAllProvinces() {
        ResponseDTO response = provinceService.getAllProvinces();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}