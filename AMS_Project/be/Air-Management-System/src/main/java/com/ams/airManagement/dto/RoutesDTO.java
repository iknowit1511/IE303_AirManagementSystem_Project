package com.ams.airManagement.dto;

import com.ams.airManagement.entity.Locations;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoutesDTO {

    private int routeId;
    private String departureLocation;
    private String destinationLocation;
    private double distance;
    private double routeTime;

}
