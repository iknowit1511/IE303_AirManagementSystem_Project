package com.ams.airManagement.controller;

import com.ams.airManagement.dto.BookingsDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.entity.Bookings;
import com.ams.airManagement.service.interfac.BookingServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingServiceInterface bookingServiceInterface;

    @PostMapping("/book-flight/{flightId}/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> saveBooking(@PathVariable String flightId,
                                                   @PathVariable int userId,
                                                   @RequestBody Bookings bookingRequest) {
        ResponseDTO response = bookingServiceInterface.saveBooking(flightId, userId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO> getAllBookings() {
        ResponseDTO response = bookingServiceInterface.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> getBookingById(@PathVariable int bookingId) {
        ResponseDTO response = bookingServiceInterface.getBookingById(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> updateBooking(@PathVariable int bookingId,
                                                     @RequestBody Bookings bookingRequest) {
        ResponseDTO response = bookingServiceInterface.updateBooking(bookingId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/cancel/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> cancelBooking(@PathVariable int bookingId) {
        ResponseDTO response = bookingServiceInterface.cancelBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteBooking(@PathVariable int bookingId) {
        ResponseDTO response = bookingServiceInterface.deleteBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> searchBookings(@RequestParam String criteria) {
        ResponseDTO response = bookingServiceInterface.searchBookings(criteria);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/multi-booking/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<ResponseDTO> bookMultipleFlights(@PathVariable int userId,
                                                           @RequestBody List<BookingsDTO> bookingList) {
        ResponseDTO response = bookingServiceInterface.bookMultipleFlights(userId, bookingList);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}