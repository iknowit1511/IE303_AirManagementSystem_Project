package com.ams.airManagement.utils;

import com.ams.airManagement.dto.BookingsDTO;
import com.ams.airManagement.dto.FlightsDTO;
import com.ams.airManagement.dto.ProvincesDTO;
import com.ams.airManagement.dto.UsersDTO;
import com.ams.airManagement.dto.LocationsDTO;
import com.ams.airManagement.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    public static UsersDTO mapUserEntityToUserDTO(Users users) {
        UsersDTO usersDTO = new UsersDTO();

        usersDTO.setUserId(users.getUserId());
        usersDTO.setUsername(users.getUsername());
        usersDTO.setEmail(users.getEmail());
        usersDTO.setRole(users.getRole());
        usersDTO.setAddress(users.getAddress());
        usersDTO.setPhone(users.getPhone());
        usersDTO.setName(users.getName());
        return usersDTO;
    }

    public static UsersDTO mapUserEntityToUserDTOAndBooking(Users users) {
        UsersDTO usersDTO = new UsersDTO();

        usersDTO.setUserId(users.getUserId());
        usersDTO.setUsername(users.getUsername());
        usersDTO.setEmail(users.getEmail());
        usersDTO.setRole(users.getRole());
        usersDTO.setAddress(users.getAddress());
        usersDTO.setPhone(users.getPhone());
        usersDTO.setName(users.getName());

        if (users.getBookings() != null) {
            usersDTO.setBookings(users.getBookings().stream()
                    .map(Utils::mapBookingEntityToBookingDTO)
                    .collect(Collectors.toList()));
        }

        return usersDTO;
    }

    public static FlightsDTO mapFlightEntityToFlightDTO(Flights flights) {
        FlightsDTO flightsDTO = new FlightsDTO();

        flightsDTO.setFlightId(flights.getFlightId());
        flightsDTO.setFlightCode((flights.getFlightCode()));
        flightsDTO.setAirline(flights.getAirline());
        flightsDTO.setSymbol(flights.getSymbol());
        flightsDTO.setTakeoffTime(flights.getTakeoffTime());
        flightsDTO.setLandingTime(flights.getLandingTime());
        flightsDTO.setTakeoffDate(flights.getTakeoffDate());
        flightsDTO.setLandingDate(flights.getLandingDate());
        flightsDTO.setOriginalPrice(flights.getOriginalPrice());
        flightsDTO.setTax(flights.getTax());
        flightsDTO.setTotalPrice(flights.getTotalPrice());
        flightsDTO.setSeatClass(flights.getSeatClass());
        flightsDTO.setDuration(flights.getDuration());
        flightsDTO.setDaysAtDestination(null);

        if (flights.getDepartureProvince() != null) {
            flightsDTO.setDepartureProvinceId(flights.getDepartureProvince().getProvinceId());
        }

        if (flights.getDestinationProvince() != null) {
            flightsDTO.setDestinationProvinceId(flights.getDestinationProvince().getProvinceId());
        }

        if (flights.getBookings() != null) {
            flightsDTO.setBookings(flights.getBookings().stream()
                    .map(Utils::mapBookingEntityToBookingDTO)
                    .collect(Collectors.toList()));
        }

        return flightsDTO;
    }

    public static ProvincesDTO mapProvinceEntityToProvinceDTO(Provinces provinces) {
        ProvincesDTO provincesDTO = new ProvincesDTO();

        provincesDTO.setProvinceId(provinces.getProvinceId());
        provincesDTO.setProvinceName(provinces.getProvinceName());
        provincesDTO.setAirport(provinces.getAirport());

        return provincesDTO;
    }

    public static BookingsDTO mapBookingEntityToBookingDTO(Bookings bookings) {
        BookingsDTO bookingsDTO = new BookingsDTO();

        bookingsDTO.setBookingId(bookings.getBookingId());
        bookingsDTO.setTicketQuantity(bookings.getTicketQuantity());
        bookingsDTO.setPrice(bookings.getPrice());
        bookingsDTO.setBookingStatus(bookings.getStatus());
        if (bookings.getUser() != null) {
            bookingsDTO.setUserId(bookings.getUser().getUserId());
        }

        if (bookings.getFlight() != null) {
            bookingsDTO.setFlightId(bookings.getFlight().getFlightId());
        }

        return bookingsDTO;
    }

    public static LocationsDTO mapLocationEntityToLocationDTO(Locations locations) {
        LocationsDTO locationsDTO = new LocationsDTO();

        locationsDTO.setLocationId(locations.getLocationId());
        locationsDTO.setProvinceId(locations.getProvince() != null ? locations.getProvince().getProvinceId() : null);
        locationsDTO.setLocationName(locations.getLocationName());
        locationsDTO.setLocationDescription(locations.getLocationDescription());
        locationsDTO.setTourTime(locations.getTourTime());
        locationsDTO.setTravelTime(locations.getTravelTime());
        locationsDTO.setPricePerDay(locations.getPricePerDay());
        return locationsDTO;
    }

    public static ProvincesDTO mapProvinceEntityToProvinceDTOAndLocation(Provinces provinces) {
        ProvincesDTO provincesDTO = new ProvincesDTO();

        provincesDTO.setProvinceId(provinces.getProvinceId());
        provincesDTO.setProvinceName(provinces.getProvinceName());
        provincesDTO.setAirport(provinces.getAirport());
        provincesDTO.setLatitude(provinces.getLatitude());
        provincesDTO.setLongitude(provinces.getLongitude());

        if (provinces.getTourLocations() != null) {
            provincesDTO.setTourLocations(provinces.getTourLocations().stream()
                    .map(Utils::mapLocationEntityToLocationDTO)
                    .collect(Collectors.toList()));
        }

        return provincesDTO;
    }

    public static List<UsersDTO> mapUserListEntityToUserListDTO(List<Users> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static List<FlightsDTO> mapFlightListEntityToFlightListDTO(List<Flights> flightList) {
        return flightList.stream().map(Utils::mapFlightEntityToFlightDTO).collect(Collectors.toList());
    }

    public static List<BookingsDTO> mapBookingListEntityToBookingListDTO(List<Bookings> bookingList) {
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
    }

    public static Provinces getProvinceById(String departureProvinceId) {
        Provinces provinces = new Provinces();
        provinces.setProvinceId(departureProvinceId);
        return provinces;
    }

    public static List<ProvincesDTO> mapLocationListEntityToProvinceListDTO(List<Provinces> locationList) {
        return locationList.stream()
                .map(Utils::mapProvinceEntityToProvinceDTOAndLocation)
                .collect(Collectors.toList());
    }

}


