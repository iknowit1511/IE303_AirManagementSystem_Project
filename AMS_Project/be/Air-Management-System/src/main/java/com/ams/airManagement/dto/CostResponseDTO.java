package com.ams.airManagement.dto;

import lombok.Data;

@Data
public class CostResponseDTO {
    private double flightCost;
    private double attractionsCost;
    private double totalCost;
}