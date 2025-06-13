package com.ams.airManagement.service.implement;

import com.ams.airManagement.dto.BookingsDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.entity.Bookings;
import com.ams.airManagement.entity.Flights;
import com.ams.airManagement.entity.Users;
import com.ams.airManagement.exception.OurException;
import com.ams.airManagement.repository.BookingsRepository;
import com.ams.airManagement.repository.FlightsRepository;
import com.ams.airManagement.repository.UsersRepository;
import com.ams.airManagement.service.interfac.BookingServiceInterface;
import com.ams.airManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingServiceInterface {

    @Autowired
    private BookingsRepository bookingsRepository;

    @Autowired
    private FlightsRepository flightsRepository;

    @Autowired
    private UsersRepository usersRepository;



    @Override
    public ResponseDTO bookMultipleFlights(int userId, List<BookingsDTO> bookingDTOList) {
        ResponseDTO responseDTO = new ResponseDTO();
        List<BookingsDTO> savedBookings = new ArrayList<>();

        try {
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found"));

            for (BookingsDTO bookingDTO : bookingDTOList) {
                Flights flight = flightsRepository.findById(bookingDTO.getFlightId())
                        .orElseThrow(() -> new OurException("Flight not found: " + bookingDTO.getFlightId()));

                Bookings booking = new Bookings();
                booking.setUser(user);
                booking.setFlight(flight);
                booking.setTicketQuantity(bookingDTO.getTicketQuantity());
                booking.setStatus("UNPAID");
                booking.setPrice(flight.getTotalPrice() * bookingDTO.getTicketQuantity());

                bookingsRepository.save(booking);

                BookingsDTO savedDTO = Utils.mapBookingEntityToBookingDTO(booking);
                savedBookings.add(savedDTO);
            }

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Multiple bookings saved successfully");
            responseDTO.setBookingList(savedBookings);

        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage("Error: " + e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Server error: " + e.getMessage());
        }

        return responseDTO;
    }


    @Override
    public ResponseDTO saveBooking(String flightId, int userId, Bookings bookingRequest) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Flights flight = flightsRepository.findById(flightId)
                    .orElseThrow(() -> new OurException("Flight not found"));
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found"));

            bookingRequest.setFlight(flight);
            bookingRequest.setUser(user);
            Double flightPrice = flight.getTotalPrice();
            bookingRequest.setPrice(flightPrice * bookingRequest.getTicketQuantity());
            bookingsRepository.save(bookingRequest);
            BookingsDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(bookingRequest);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Booking saved successfully");
            responseDTO.setBookingsDTO(bookingDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error saving booking: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO cancelBooking(int bookingId) {
        ResponseDTO responseDTO = new ResponseDTO();

        try {
            bookingsRepository.findById(bookingId).orElseThrow(() -> new OurException("Booking Does Not Exist"));
            bookingsRepository.deleteById(bookingId);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("successful");

        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());

        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error Cancelling a booking: " + e.getMessage());

        }
        return responseDTO;
    }

    @Override
    public ResponseDTO searchBookings(String criteria) {
        return null;
    }

    @Override
    public ResponseDTO getAllBookings() {
        ResponseDTO responseDTO = new ResponseDTO();

        try {
            List<Bookings> bookingList = bookingsRepository.findAll();
            List<BookingsDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful");
            responseDTO.setBookingList(bookingDTOList);

        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());

        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error Getting all bookings: " + e.getMessage());

        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getBookingById(int bookingId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Bookings booking = bookingsRepository.findById(bookingId)
                    .orElseThrow(() -> new OurException("Booking not found"));
            BookingsDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(booking);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Booking retrieved successfully");
            responseDTO.setBookingsDTO(bookingDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error retrieving booking: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO updateBooking(int bookingId, Bookings bookingRequest) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Bookings existingBooking = bookingsRepository.findById(bookingId)
                    .orElseThrow(() -> new OurException("Booking not found"));

            existingBooking.setTicketQuantity(bookingRequest.getTicketQuantity());
            bookingsRepository.save(existingBooking);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Booking updated successfully");
        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error updating booking: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO deleteBooking(int bookingId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Bookings booking = bookingsRepository.findById(bookingId)
                    .orElseThrow(() -> new OurException("Booking not found"));

            bookingsRepository.delete(booking);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Booking deleted successfully");
        } catch (OurException e) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error deleting booking: " + e.getMessage());
        }
        return responseDTO;
    }
}