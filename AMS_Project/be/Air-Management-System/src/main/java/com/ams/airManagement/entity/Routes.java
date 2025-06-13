package com.ams.airManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tour_route")
public class Routes {

    @Id
    @Column(name = "route_id")
    private int routeId;

    @ManyToOne
    @JoinColumn(name = "departure_location_id", referencedColumnName = "location_id", nullable = false)
    private Locations departureLocation;

    @ManyToOne
    @JoinColumn(name = "destination_location_id", referencedColumnName = "location_id", nullable = false)
    private Locations destinationLocation;

    @Column(name = "distance")
    private double distance;

    @Column(name = "route_time")
    private double routeTime;

}
