package com.ams.airManagement.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name ="bookings")
public class Bookings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private int bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flights flight;

    @Column(name = "price")
    private Double price;

    @Column(name = "ticket_quantity")
    private Integer ticketQuantity;

    @Column(name = "booking_status")
    private String status = "UNPAID";

    @OneToOne(mappedBy = "bookings", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;
}
