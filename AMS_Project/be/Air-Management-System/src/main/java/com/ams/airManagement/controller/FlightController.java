package com.ams.airManagement.controller;

import com.ams.airManagement.dto.FlightsDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.dto.TripRequestDTO;
import com.ams.airManagement.entity.Flights;
import com.ams.airManagement.service.interfac.FlightServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    @Autowired
    private FlightServiceInterface flightService;

    @PostMapping("/add")
    public ResponseEntity<ResponseDTO> addFlight(@RequestBody Flights flight,
                                                 @RequestParam(value = "departure_province_id", required = false) String departureProvinceId,
                                                 @RequestParam(value = "destination_province_id", required = false) String destinationProvinceId) {
        ResponseDTO response = flightService.addNewFlight(flight, departureProvinceId, destinationProvinceId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getAllFlights() {
        ResponseDTO response = flightService.getAllFlights(50, 100);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getFlightById(@PathVariable("id") String flightId) {
        ResponseDTO response = flightService.getFlightById(flightId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseDTO> updateFlight(@PathVariable("id") String flightId, @RequestBody Flights flight) {
        ResponseDTO response = flightService.updateFlight(flightId, flight);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDTO> deleteFlight(@PathVariable("id") String flightId) {
        ResponseDTO response = flightService.deleteFlight(flightId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @GetMapping("/search")
    public ResponseEntity<List<FlightsDTO>> searchFlights(
            @RequestParam("departure_province_id") String departureProvinceId,
            @RequestParam("destination_province_id") String destinationProvinceId,
            @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") String date,
            @RequestParam(value = "sortBy", defaultValue = "totalPrice") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "asc") String sortOrder,
            @RequestParam(value = "airlines", required = false) String airlines) {

        List<FlightsDTO> flights = flightService.searchFlights(departureProvinceId, destinationProvinceId, date, airlines);
        flights = flightService.sortFlights(flights, sortBy, sortOrder);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/searchbytime")
    public ResponseEntity<List<FlightsDTO>> searchFlightsByTime(
            @RequestParam("departure_province_id") String departureProvinceId,
            @RequestParam("destination_province_id") String destinationProvinceId,
            @RequestParam("date") @DateTimeFormat(pattern = "d/M/yyyy") String date) {

        List<FlightsDTO> flights = flightService.searchFlightsbytime(departureProvinceId, destinationProvinceId, date);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/search-by-date-range")
    public ResponseEntity<List<FlightsDTO>> searchFlightsByDateRange(
            @RequestParam("departure_province_id") String departureProvinceId,
            @RequestParam("destination_province_id") String destinationProvinceId,
            @RequestParam("start_date") String startDate,
            @RequestParam("end_date") String endDate) {
        try {
            List<FlightsDTO> flights = flightService.searchFlightsByDateRange(
                    departureProvinceId, destinationProvinceId, startDate, endDate);
            return ResponseEntity.ok(flights);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/searchandreturn")
    public ResponseEntity<List<FlightsDTO>> searchFlightAndReturn(
            @RequestParam("departure_province_id") String departureProvinceId,
            @RequestParam("destination_province_id") String destinationProvinceId,
            @RequestParam("datecome") @DateTimeFormat(pattern = "d/M/yyyy") String dateCome,
            @RequestParam("datereturn") @DateTimeFormat(pattern = "d/M/yyyy") String dateReturn) {

        List<FlightsDTO> flights = flightService.searchFlightandreturn(departureProvinceId, destinationProvinceId, dateCome, dateReturn);
        return ResponseEntity.ok(flights);
    }

    @PostMapping("/find-cheapest-flights")
    public ResponseEntity<ResponseDTO> findCheapestFlightsForTrip(@RequestBody TripRequestDTO tripRequest) {
        ResponseDTO response = flightService.findCheapestFlightsForTrip(
                tripRequest.getDepartureProvinceId(),
                tripRequest.getDestinationProvinceIds(),
                tripRequest.getTotalDays(),
                tripRequest.getStartDate(),
                tripRequest.getEndDate()
        );
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}
