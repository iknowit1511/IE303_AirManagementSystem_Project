package com.ams.airManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingsDTO {

    private int bookingId;

    private int userId;
    private String flightId;
    private Double price;
    private Integer ticketQuantity;
    private String bookingDate;
    private String bookingStatus;
}
