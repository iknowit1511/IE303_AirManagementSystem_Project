package com.ams.airManagement.dto;

import com.ams.airManagement.entity.Bookings;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsersDTO {

    private int userId;
    private String username;
    private String email;
    private String role;
    private String status;
    private String phone;
    private String address;
    private String name;
    private List<BookingsDTO> bookings = new ArrayList<>();

}
