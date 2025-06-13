package com.ams.airManagement.controller;


import com.ams.airManagement.dto.LoginRequestDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.entity.Users;
import com.ams.airManagement.service.interfac.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserServiceInterface userService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody Users users) {
        ResponseDTO responseDTO = userService.register(users);
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        ResponseDTO responseDTO = userService.login(loginRequest);
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

}
