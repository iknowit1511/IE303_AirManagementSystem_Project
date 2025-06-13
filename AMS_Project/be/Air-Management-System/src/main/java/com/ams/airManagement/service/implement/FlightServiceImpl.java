package com.ams.airManagement.service.implement;

import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.dto.FlightsDTO;
import com.ams.airManagement.entity.Flights;
import com.ams.airManagement.exception.OurException;
import com.ams.airManagement.repository.FlightsRepository;
import com.ams.airManagement.service.interfac.FlightServiceInterface;
import com.ams.airManagement.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlightServiceImpl implements FlightServiceInterface {

    @Autowired
    private FlightsRepository flightsRepository;

    @Override
    public ResponseDTO addNewFlight(Flights flight, String departureProvinceId, String destinationProvinceId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            if (flightsRepository.existsById(flight.getFlightId())) {
                throw new OurException("Flight with ID " + flight.getFlightId() + " already exists!");
            }

            // Set departure and destination province if provided
            if (flight.getDepartureProvince() == null && departureProvinceId != null) {
                flight.setDepartureProvince(Utils.getProvinceById(departureProvinceId));
            }
            if (flight.getDestinationProvince() == null && destinationProvinceId != null) {
                flight.setDestinationProvince(Utils.getProvinceById(destinationProvinceId));
            }

            Flights savedFlight = flightsRepository.save(flight);
            FlightsDTO flightsDTO = Utils.mapFlightEntityToFlightDTO(savedFlight);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Flight added successfully!");
            responseDTO.setFlightsDTO(flightsDTO);

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error while adding flight: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getAllFlights(int limit, int offset) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            // Use Spring Data JPA paging
            org.springframework.data.domain.Pageable pageable = PageRequest.of(offset / limit, limit);
            List<Flights> flightsList = flightsRepository.findAll(pageable).getContent();
            List<FlightsDTO> flightsDTOList = Utils.mapFlightListEntityToFlightListDTO(flightsList);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successfully retrieved all flights.");
            responseDTO.setFlightList(flightsDTOList);

        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error while getting all flights: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getFlightById(String flightId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Flights flight = flightsRepository.findById(flightId)
                    .orElseThrow(() -> new OurException("Flight not found with ID: " + flightId));
            FlightsDTO flightDTO = Utils.mapFlightEntityToFlightDTO(flight);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Flight retrieved successfully.");
            responseDTO.setFlightsDTO(flightDTO);

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error while getting flight: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO deleteFlight(String flightId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Flights flight = flightsRepository.findById(flightId)
                    .orElseThrow(() -> new OurException("Flight not found with ID: " + flightId));

            flightsRepository.delete(flight);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Flight deleted successfully.");

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error while deleting flight: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO updateFlight(String flightId, Flights updatedFlight) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Flights existingFlight = flightsRepository.findById(flightId)
                    .orElseThrow(() -> new OurException("Flight not found with ID: " + flightId));

            // Cập nhật các trường nếu khác null
            if (updatedFlight.getFlightCode() != null) {
                existingFlight.setFlightCode(updatedFlight.getFlightCode());
            }
            if (updatedFlight.getAirline() != null) {
                existingFlight.setAirline(updatedFlight.getAirline());
            }
            if (updatedFlight.getSymbol() != null) {
                existingFlight.setSymbol(updatedFlight.getSymbol());
            }
            if (updatedFlight.getTakeoffTime() != null) {
                existingFlight.setTakeoffTime(updatedFlight.getTakeoffTime());
            }
            if (updatedFlight.getLandingTime() != null) {
                existingFlight.setLandingTime(updatedFlight.getLandingTime());
            }
            if (updatedFlight.getOriginalPrice() != null) {
                existingFlight.setOriginalPrice(updatedFlight.getOriginalPrice());
            }
            if (updatedFlight.getTax() != null) {
                existingFlight.setTax(updatedFlight.getTax());
            }
            if (updatedFlight.getTotalPrice() != null) {
                existingFlight.setTotalPrice(updatedFlight.getTotalPrice());
            }
            if (updatedFlight.getSeatClass() != null) {
                existingFlight.setSeatClass(updatedFlight.getSeatClass());
            }
            if (updatedFlight.getDepartureProvince() != null) {
                existingFlight.setDepartureProvince(updatedFlight.getDepartureProvince());
            }
            if (updatedFlight.getDestinationProvince() != null) {
                existingFlight.setDestinationProvince(updatedFlight.getDestinationProvince());
            }

            Flights savedFlight = flightsRepository.save(existingFlight);
            FlightsDTO flightsDTO = Utils.mapFlightEntityToFlightDTO(savedFlight);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Flight updated successfully.");
            responseDTO.setFlightsDTO(flightsDTO);

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error while updating flight: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public List<FlightsDTO> searchFlights(String departureProvinceId, String destinationProvinceId, String date, String airlines) {
        // Validate date format yyyy-MM-dd
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            throw new OurException("Invalid date format. Please use yyyy-MM-dd (e.g., 2024-06-01).");
        }

        String datePrefix = date + "%"; // Example: "2024-06-01%"

        List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                departureProvinceId, destinationProvinceId, datePrefix);

        // Filter by airlines if provided
        if (airlines != null && !airlines.isBlank()) {
            List<String> airlineList = java.util.Arrays.stream(airlines.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            flights = flights.stream()
                    .filter(flight -> airlineList.contains(flight.getAirline()))
                    .collect(Collectors.toList());
        }

        return Utils.mapFlightListEntityToFlightListDTO(flights);
    }
    @Override
    public double calculateBestScoreDTO(FlightsDTO flights) {
        // Giả sử bạn muốn tính điểm dựa trên giá vé và thời gian bay
        double priceScore = 1.0 / flights.getTotalPrice(); // Điểm càng cao nếu giá càng thấp
        double durationScore = 1.0 / flights.getDuration(); // Điểm càng cao nếu thời gian bay càng ngắn

        // Kết hợp hai điểm này để tính điểm tổng thể
        return (priceScore + durationScore) / 2; // Trung bình cộng
    }

    @Override
    public List<FlightsDTO> sortFlights(List<FlightsDTO> flights, String sortBy, String sortOrder) {
        Comparator<FlightsDTO> comparator;
        if ("totalPrice".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(FlightsDTO::getTotalPrice);
        } else if ("duration".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(FlightsDTO::getDuration);
        } else if ("best".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(this::calculateBestScoreDTO);
        } else {
            comparator = Comparator.comparing(FlightsDTO::getTotalPrice); // Default to price
        }
        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed();
        }
        return flights.stream().sorted(comparator).collect(java.util.stream.Collectors.toList());
    }




    @Override
    public List<FlightsDTO> searchFlightsbytime(String departureProvinceId, String destinationProvinceId, String date) {
        // Xác thực định dạng ngày
        if (!date.matches("\\d{1,2}/\\d{1,2}/\\d{4}")) {
            throw new OurException("Invalid date format. Please use d/M/yy (e.g., 4/1/2021).");
        }

        String datePrefix = date + "%"; // Ví dụ: "4/1/21%"

        List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                departureProvinceId, destinationProvinceId, datePrefix);

        // Sắp xếp theo takeoffTime
        flights.sort(Comparator.comparing(Flights::getTakeoffTime));

        return Utils.mapFlightListEntityToFlightListDTO(flights);
    }


    @Override
    public List<FlightsDTO> searchFlightsByDateRange(String departureProvinceId, String destinationProvinceId, String startDate, String endDate) {
        // Xác thực định dạng ngày (yyyy-MM-dd)
        if (!startDate.matches("\\d{4}-\\d{2}-\\d{2}") || !endDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
            throw new OurException("Invalid date format. Please use yyyy-MM-dd (e.g., 2024-06-01).");
        }

        List<Flights> flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateBetween(
                departureProvinceId, destinationProvinceId, startDate, endDate);

        // Sắp xếp theo takeoffTime
        flights.sort(Comparator.comparing(Flights::getTakeoffTime));

        return Utils.mapFlightListEntityToFlightListDTO(flights);
    }

    public List<FlightsDTO> searchFlightandreturn(String departureProvinceId, String destinationProvinceId, String datecome, String datereturn) {
        // Xác thực định dạng ngày (d/M/yyyy, ví dụ: 4/1/2021)
        if (!datecome.matches("\\d{1,2}/\\d{1,2}/\\d{4}") || !datereturn.matches("\\d{1,2}/\\d{1,2}/\\d{4}")) {
            throw new OurException("Định dạng ngày không hợp lệ. Vui lòng dùng d/M/yyyy (ví dụ: 4/1/2021).");
        }

        String datecomePrefix = datecome + "%"; // Ví dụ: "4/1/2021%"
        String datereturnPrefix = datereturn + "%"; // Ví dụ: "4/2/2021%"

        // Tìm chuyến bay đi
        List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                departureProvinceId, destinationProvinceId, datecomePrefix);

        // Tìm chuyến bay khứ hồi
        List<Flights> returnFlights = flightsRepository.searchByDepartureDestinationAndDate(
                destinationProvinceId, departureProvinceId, datereturnPrefix);

        // Gộp hai danh sách
        flights.addAll(returnFlights);

        // Sắp xếp theo takeoffTime, rồi đến totalPrice
        SimpleDateFormat sdf = new SimpleDateFormat("d/M/yyyy h:mm a");
        // Sắp xếp theo takeoffTime
        flights.sort(Comparator.comparing(Flights::getTakeoffTime).thenComparing(Flights::getTotalPrice));

        // Chuyển đổi sang DTO
        return Utils.mapFlightListEntityToFlightListDTO(flights);
    }


    @Override
    public ResponseDTO findCheapestFlightsForTrip(String departureProvinceId, List<String> destinationProvinceIds,
                                                  int totalDays, String startDate, String endDate) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            // Validate inputs
            if (destinationProvinceIds == null || destinationProvinceIds.isEmpty()) {
                throw new OurException("No destination provinces provided.");
            }

            // Check for HCM and filter destinations
            boolean hasHCM = destinationProvinceIds.stream().anyMatch(id -> "HCM".equalsIgnoreCase(id));
            List<String> filteredDestinations = destinationProvinceIds.stream()
                    .filter(id -> !"HCM".equalsIgnoreCase(id))
                    .collect(Collectors.toList());

            // Special case: only HCM in destination
            if (filteredDestinations.isEmpty() && hasHCM) {
                // Only stay in HCM for totalDays
                List<FlightsDTO> tripFlights = new ArrayList<>();
                FlightsDTO hcmStay = new FlightsDTO();
                hcmStay.setDepartureProvinceId("HCM");
                hcmStay.setDestinationProvinceId("HCM");
                hcmStay.setDaysAtDestination(totalDays);
                hcmStay.setTotalPrice(0.0);
                tripFlights.add(hcmStay);

                responseDTO.setStatusCode(200);
                responseDTO.setMessage("Only HCM in destination, stay in HCM for " + totalDays + " days.");
                responseDTO.setFlightList(tripFlights);
                return responseDTO;
            }

            // Calculate days allocation
            int hcmDays = hasHCM ? 2 : 0;
            int daysForOther = totalDays - hcmDays;
            if (daysForOther < filteredDestinations.size() || daysForOther > filteredDestinations.size() * 2) {
                throw new OurException("Total days (excluding HCM) must be between " + filteredDestinations.size() +
                        " and " + (filteredDestinations.size() * 2));
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate currentDate = LocalDate.parse(startDate, formatter);
            List<FlightsDTO> tripFlights = new ArrayList<>();
            double totalCost = 0.0;
            String tempProvince = departureProvinceId;
            LocalDate tempDate = currentDate;

            // If HCM is included, stay in HCM for 2 days first
            if (hasHCM) {
                FlightsDTO hcmStay = new FlightsDTO();
                hcmStay.setDepartureProvinceId("HCM");
                hcmStay.setDestinationProvinceId("HCM");
                hcmStay.setDaysAtDestination(2);
                hcmStay.setTotalPrice(0.0);
                tripFlights.add(hcmStay);
                tempDate = tempDate.plusDays(2);
            }

            // Initialize days allocation: start with 1 day per destination
            int remainingDays = daysForOther - filteredDestinations.size();
            Map<String, Integer> daysAllocation = new LinkedHashMap<>();
            for (String dest : filteredDestinations) {
                daysAllocation.put(dest, 1); // Start with minimum 1 day
            }

            // Greedily distribute remaining days to minimize flight costs
            while (remainingDays > 0) {
                String bestDest = null;
                double bestCostReduction = Double.NEGATIVE_INFINITY;
                Flights bestFlight = null;
                LocalDate bestDate = tempDate;

                for (String dest : filteredDestinations) {
                    if (daysAllocation.get(dest) >= 2) continue; // Skip if already at max days (2)

                    // Simulate staying one more day at current destination
                    LocalDate nextDate = tempDate.plusDays(daysAllocation.get(dest) + 1);
                    double currentCost = Double.MAX_VALUE;
                    Flights currentFlight = null;

                    // Check flights for next leg with adjusted date
                    for (int i = 0; i < 2; i++) {
                        String searchDate = nextDate.plusDays(i).format(formatter) + "%";
                        List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                                dest, getNextDestination(dest, filteredDestinations, daysAllocation), searchDate);
                        if (!flights.isEmpty()) {
                            Flights cheapest = flights.stream()
                                    .min(Comparator.comparing(Flights::getTotalPrice))
                                    .orElse(null);
                            if (cheapest != null && cheapest.getTotalPrice() < currentCost) {
                                currentCost = cheapest.getTotalPrice();
                                currentFlight = cheapest;
                            }
                        }
                    }

                    if (currentFlight != null) {
                        // Estimate cost reduction (simplified: prioritize cheaper next flights)
                        double costReduction = -currentCost; // Negative because lower cost is better
                        if (costReduction > bestCostReduction) {
                            bestCostReduction = costReduction;
                            bestDest = dest;
                            bestFlight = currentFlight;
                            bestDate = nextDate;
                        }
                    }
                }

                if (bestDest != null) {
                    daysAllocation.put(bestDest, daysAllocation.get(bestDest) + 1);
                    remainingDays--;
                } else {
                    break; // No valid flight found, stop allocating
                }
            }

            // Build trip itinerary based on allocation
            for (String destProvinceId : filteredDestinations) {
                int daysAtDestination = daysAllocation.get(destProvinceId);
                Flights cheapestFlight = null;
                double minPrice = Double.MAX_VALUE;

                // Search for cheapest flight within 2 days of current tempDate
                for (int i = 0; i < 2; i++) {
                    String searchDate = tempDate.plusDays(i).format(formatter) + "%";
                    List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                            tempProvince, destProvinceId, searchDate);
                    if (!flights.isEmpty()) {
                        Flights cheapest = flights.stream()
                                .min(Comparator.comparing(Flights::getTotalPrice))
                                .orElse(null);
                        if (cheapest != null && cheapest.getTotalPrice() < minPrice) {
                            minPrice = cheapest.getTotalPrice();
                            cheapestFlight = cheapest;
                        }
                    }
                }

                if (cheapestFlight == null) {
                    throw new OurException("No flight found from " + tempProvince + " to " + destProvinceId);
                }

                totalCost += cheapestFlight.getTotalPrice();
                FlightsDTO flightDTO = Utils.mapFlightEntityToFlightDTO(cheapestFlight);
                flightDTO.setDaysAtDestination(daysAtDestination);
                tripFlights.add(flightDTO);

                tempProvince = destProvinceId;
                tempDate = tempDate.plusDays(daysAtDestination);
            }

            // Add return flight to HCM on the last day
            Flights returnFlight = null;
            double minReturnPrice = Double.MAX_VALUE;
            for (int i = 0; i < 2; i++) {
                String searchDate = tempDate.plusDays(i).format(formatter) + "%";
                List<Flights> flights = flightsRepository.searchByDepartureDestinationAndDate(
                        tempProvince, "HCM", searchDate);
                if (!flights.isEmpty()) {
                    Flights cheapest = flights.stream()
                            .min(Comparator.comparing(Flights::getTotalPrice))
                            .orElse(null);
                    if (cheapest != null && cheapest.getTotalPrice() < minReturnPrice) {
                        minReturnPrice = cheapest.getTotalPrice();
                        returnFlight = cheapest;
                    }
                }
            }

            if (returnFlight == null) {
                throw new OurException("No return flight found to HCM");
            }

            totalCost += returnFlight.getTotalPrice();
            FlightsDTO returnFlightDTO = Utils.mapFlightEntityToFlightDTO(returnFlight);
            returnFlightDTO.setDaysAtDestination(0);
            tripFlights.add(returnFlightDTO);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Cheapest flights found successfully.");
            responseDTO.setFlightList(tripFlights);
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error finding cheapest flights: " + e.getMessage());
        }
        return responseDTO;
    }

    // Helper method to get the next destination for cost estimation
    private String getNextDestination(String currentDest, List<String> destinations, Map<String, Integer> daysAllocation) {
        int currentIndex = destinations.indexOf(currentDest);
        if (currentIndex < destinations.size() - 1) {
            return destinations.get(currentIndex + 1);
        } else {
            return "HCM"; // Last leg returns to HCM
        }
    }

}
