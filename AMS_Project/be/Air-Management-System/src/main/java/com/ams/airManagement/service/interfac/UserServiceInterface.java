package com.ams.airManagement.service.interfac;


import com.ams.airManagement.dto.LoginRequestDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.dto.UsersDTO;
import com.ams.airManagement.entity.Users;

public interface UserServiceInterface {

    ResponseDTO register(Users users);
    ResponseDTO login(LoginRequestDTO loginRequest);
    ResponseDTO getAllUsers();
    ResponseDTO getUserById(Integer userId);
    ResponseDTO getUserByEmail(String email);
    ResponseDTO deleteUser(Integer userId);
    ResponseDTO updateUser(Integer userId, UsersDTO updateUserDTO);
    ResponseDTO getMyInfo(String email);
    ResponseDTO getUserBooking(Integer userId);
    ResponseDTO changePassword(Integer userId, String oldPassword, String newPassword);
//  ResponseDTO createBookingForUser(Integer userId, BookingsDTO bookingDTO);
}
