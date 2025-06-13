package com.ams.airManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.Data;

@Data
public class TripRequestDTO {
    @NotBlank(message = "Departure province ID is required")
    private String departureProvinceId;

    @NotNull(message = "Destination province IDs are required")
    private List<String> destinationProvinceIds;

    @Positive(message = "Total days must be positive")
    private int totalDays;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;
}