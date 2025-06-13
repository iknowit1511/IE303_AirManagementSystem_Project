package com.ams.airManagement.repository;

import com.ams.airManagement.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingsRepository extends JpaRepository<Bookings, Integer> {

    List<Bookings> findByUser_UserId(int userId);
    List<Bookings> findByFlight_FlightId(String flightId);

}
