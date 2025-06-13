package com.ams.airManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "tour_location")
public class Locations {

    @Id
    @Column(name = "location_id")
    private int locationId;

    @ManyToOne
    @JoinColumn(name = "province_id", nullable = false)
    private Provinces province;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "location_description")
    private String locationDescription;

    @Column(name = "tour_time")
    private double tourTime;

    @Column(name = "travel_time")
    private double travelTime;

    @Column(name = "price_per_day")
    private int pricePerDay;

    @Column(name = "location_type")
    private String locationType;

    @OneToMany(mappedBy = "departureLocation", fetch = FetchType.LAZY)
    private List<Routes> departureRoutes = new ArrayList<>();

    @OneToMany(mappedBy = "destinationLocation", fetch = FetchType.LAZY)
    private List<Routes> destinationRoutes = new ArrayList<>();

}