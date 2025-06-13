package com.ams.airManagement.repository;

import com.ams.airManagement.entity.Flights;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightsRepository extends JpaRepository<Flights, String> {

//    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndSeatClass(
//            String departureId, String destinationId, String seatClass);
//
//    List<Flights> findByTakeoffTime(String takeoffTime);
//
//    @Query("SELECT f FROM Flights f WHERE f.departureProvince.provinceId = :from AND f.destinationProvince.provinceId = :to")
//    List<Flights> findByRoute(@Param("from") String from, @Param("to") String to);
//
//    @Query("SELECT f FROM Flights f WHERE f.departureProvince.provinceId = :from AND f.destinationProvince.provinceId = :to AND f.takeoffDate = :date")
//    List<Flights> findByRouteAndDate(@Param("from") String from, @Param("to") String to, @Param("date") String date);
//
//    @Query("SELECT f FROM Flights f WHERE f.departureProvince.provinceId = :from AND f.destinationProvince.provinceId = :to AND f.takeoffTime = :time")
//    List<Flights> findByRouteAndTime(@Param("from") String from, @Param("to") String to, @Param("time") String time);
//
//    @Query("SELECT f FROM Flights f WHERE f.departureProvince.provinceId = :from AND f.destinationProvince.provinceId = :to AND f.takeoffDate = :date AND f.takeoffTime = :time")
//    List<Flights> findByRouteAndDateAndTime(@Param("from") String from, @Param("to") String to, @Param("date") String date, @Param("time") String time);
//
//    @Query("SELECT f FROM Flights f WHERE f.airline LIKE %:airline%")
//    List<Flights> findByAirline(@Param("airline") String airline);
//
//    @Query("SELECT f FROM Flights f WHERE f.airline LIKE %:airline% AND f.takeoffDate = :date")
//    List<Flights> findByAirlineAndDate(@Param("airline") String airline, @Param("date") String date);
//
//    @Query("SELECT f FROM Flights f WHERE f.airline LIKE %:airline% AND f.takeoffTime = :time")
//    List<Flights> findByAirlineAndTime(@Param("airline") String airline, @Param("time") String time);
//
//    @Query("SELECT f FROM Flights f WHERE f.airline LIKE %:airline% AND f.takeoffDate = :date AND f.takeoffTime = :time")
//    List<Flights> findByAirlineAndDateAndTime(@Param("airline") String airline, @Param("date") String date, @Param("time") String time);
//    // find with sql => add later
//    //@Query("select f from flights f")
//    //List<Flights> getAvailableFlights();

    @Query("SELECT f FROM Flights f WHERE " +
            "f.departureProvince.provinceId = :departureProvinceId AND " +
            "f.destinationProvince.provinceId = :destinationProvinceId AND " +
            "f.takeoffDate LIKE :datePrefix")
    List<Flights> searchByDepartureDestinationAndDate(
            @Param("departureProvinceId") String departureProvinceId,
            @Param("destinationProvinceId") String destinationProvinceId,
            @Param("datePrefix") String datePrefix);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateBetween(
            String departureProvinceId, String destinationProvinceId, String startDate, String endDate);

    @Query("SELECT f FROM Flights f WHERE f.departureProvince.provinceId = :departureProvinceId " +
            "AND f.destinationProvince.provinceId = :destinationProvinceId " +
            "AND f.takeoffDate BETWEEN :startDate AND :endDate " +
            "ORDER BY f.totalPrice ASC")
    List<Flights> findCheapestFlights(@Param("departureProvinceId") String departureProvinceId,
                                      @Param("destinationProvinceId") String destinationProvinceId,
                                      @Param("startDate") String startDate,
                                      @Param("endDate") String endDate);


    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndTakeoffTime(
            String departureProvinceId, String destinationProvinceId, String takeoffDate, String takeoffTime);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDate(
            String departureProvinceId, String destinationProvinceId, String takeoffDate);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffTime(
            String departureProvinceId, String destinationProvinceId, String takeoffTime);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceId(
            String departureProvinceId, String destinationProvinceId);

    List<Flights> findByAirlineAndTakeoffDateAndTakeoffTime(
            String airline, String takeoffDate, String takeoffTime);

    List<Flights> findByAirlineAndTakeoffDate(
            String airline, String takeoffDate);

    List<Flights> findByAirlineAndTakeoffTime(
            String airline, String takeoffTime);

    List<Flights> findByAirline(String airline);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndAirline(String departureProvinceId, String destinationProvinceId, String airline);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndAirline(String departureProvinceId, String destinationProvinceId, String takeoffDate, String airline);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffTimeAndAirline(String departureProvinceId, String destinationProvinceId, String takeoffTime, String airline);

    List<Flights> findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndTakeoffTimeAndAirline(String departureProvinceId, String destinationProvinceId, String takeoffDate, String takeoffTime, String airline);
}

