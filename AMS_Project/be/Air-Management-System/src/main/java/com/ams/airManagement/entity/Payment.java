package com.ams.airManagement.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment")
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private int paymentId;

    @Column(name = "amount")
    private double amount;

    @Column(name = "method")
    private String method;

    @Column(name = "payment_date")
    private String paymentDate;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Bookings bookings;

}
