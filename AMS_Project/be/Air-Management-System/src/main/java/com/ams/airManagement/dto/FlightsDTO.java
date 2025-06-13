package com.ams.airManagement.dto;

import com.ams.airManagement.entity.Bookings;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlightsDTO {

    private String flightId;
    private String flightCode;
    private String airline;
    private String symbol;
    private String takeoffTime;
    private String landingTime;
    private String takeoffDate;
    private String landingDate;
    private Double originalPrice;
    private Double tax;
    private Double totalPrice;

    private String departureProvinceId;
    private String destinationProvinceId;

    private String seatClass;
    private Integer duration;
    private Integer daysAtDestination; // Added field
    private List<BookingsDTO> bookings = new ArrayList<>();
}
