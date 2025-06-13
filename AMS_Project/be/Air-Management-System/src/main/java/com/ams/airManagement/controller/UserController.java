package com.ams.airManagement.controller;


import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.dto.UsersDTO;
import com.ams.airManagement.service.interfac.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserServiceInterface userService;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO> getAllUsers() {
        ResponseDTO responseDTO = userService.getAllUsers();
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseDTO> getUserById(@PathVariable("userId") Integer userId) {
        ResponseDTO responseDTO = userService.getUserById(userId);
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @GetMapping("/email")
    public ResponseEntity<ResponseDTO> getUserByEmail(@RequestParam String email) {
        ResponseDTO response = userService.getUserByEmail(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("delete/{userId}")
    public ResponseEntity<ResponseDTO> deleteUser(@PathVariable("userId") Integer userId) {
        ResponseDTO responseDTO = userService.deleteUser(userId);
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseDTO> getLoggedInUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ResponseDTO responseDTO = userService.getMyInfo(email);
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @GetMapping("/{userId}/bookings")
    public ResponseEntity<ResponseDTO> getUserBooking(@PathVariable("userId") Integer userId) {
        ResponseDTO response = userService.getUserBooking(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<ResponseDTO> updateUser(@PathVariable Integer userId, @RequestBody UsersDTO updateUserDTO) {
        ResponseDTO response = userService.updateUser(userId, updateUserDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/change-password/{userId}")
    public ResponseEntity<ResponseDTO> changePassword(@PathVariable Integer userId,
                                                      @RequestParam String oldPassword,
                                                      @RequestParam String newPassword) {
        ResponseDTO response = userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
