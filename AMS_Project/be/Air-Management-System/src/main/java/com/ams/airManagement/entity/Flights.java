package com.ams.airManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "flights")
public class Flights {

    @Id
    @Column(name = "flight_id", length = 15)
    private String flightId;

    @Column(name = "flight_code", length = 3)
    private String flightCode;

    @Column(name = "airline", length = 18)
    private String airline;

    @Column(name = "symbol", length = 6)
    private String symbol;

    @Column(name = "takeoff_time")
    private String takeoffTime;

    @Column(name = "landing_time")
    private String landingTime;

    @Column(name = "original_price")
    private Double originalPrice;

    @Column(name = "tax")
    private Double tax;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "takeoff_date")
    private String takeoffDate;

    @Column(name = "landing_date")
    private String landingDate;


    @ManyToOne
    @JoinColumn(name = "departure_province_id", referencedColumnName = "province_id", nullable = false)
    private Provinces departureProvince;

    @ManyToOne
    @JoinColumn(name = "destination_province_id", referencedColumnName = "province_id", nullable = false)
    private Provinces destinationProvince;

    @Column(name = "seat_class", length = 31)
    private String seatClass;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bookings> bookings = new ArrayList<>();

    @Column(name = "duration")
    private Integer duration;


}