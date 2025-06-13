package com.ams.airManagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "provinces")
public class Provinces {

    @Id
    @Column(name = "province_id")
    private String provinceId;

    @Column(name = "province_name")
    private String provinceName;

    @Column(name = "airport")
    private String airport;

    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Locations> tourLocations = new ArrayList<>();

    @OneToMany(mappedBy = "departureProvince", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flights> departures = new ArrayList<>();

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @OneToMany(mappedBy = "destinationProvince", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flights> arrivals = new ArrayList<>();
}
