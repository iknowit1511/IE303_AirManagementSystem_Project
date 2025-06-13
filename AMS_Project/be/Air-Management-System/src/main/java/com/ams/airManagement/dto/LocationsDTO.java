package com.ams.airManagement.dto;

import com.ams.airManagement.entity.Provinces;
import com.ams.airManagement.entity.Routes;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationsDTO {

    private int locationId;
    private String provinceId;
    private String locationName;
    private String locationDescription;
    private double tourTime;
    private double travelTime;
    private int pricePerDay;
    private String locationType;
}
