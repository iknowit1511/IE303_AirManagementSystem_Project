package com.ams.airManagement.service.implement;

import com.ams.airManagement.dto.PaymentDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.entity.Bookings;
import com.ams.airManagement.entity.Flights;
import com.ams.airManagement.entity.Payment;
import com.ams.airManagement.exception.OurException;
import com.ams.airManagement.repository.BookingsRepository;
import com.ams.airManagement.repository.PaymentRepository;
import com.ams.airManagement.service.interfac.NotificationService;
import com.ams.airManagement.service.interfac.NotificationService;
import com.ams.airManagement.service.interfac.PaymentServiceInterface;
import com.ams.airManagement.utils.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Date;

@Service
public class PaymentServiceImpl implements PaymentServiceInterface {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingsRepository bookingsRepository;
    @Autowired
    private NotificationService notificationServiceInterface;

    @Override
    public ResponseDTO makePayment(PaymentDTO paymentDTO) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Bookings bookings = bookingsRepository.findById(paymentDTO.getBookingId()).orElseThrow(() -> new OurException("Booking not found!"));

            Payment payment = Payment.builder()
                    .amount(paymentDTO.getAmount())
                    .method(paymentDTO.getMethod())
                    .paymentDate(String.valueOf(new Date()))
                    .bookings(bookings)
                    .build();

            paymentRepository.save(payment);
            bookings.setStatus("PAID");
            bookingsRepository.save(bookings);

            try {
                String toEmail = bookings.getUser().getEmail();
                String subject = "Confirming for your flight booking - Booking ID: #" + bookings.getBookingId();

                Flights flight = bookings.getFlight();
                String passengerName = bookings.getUser().getUsername();
                Integer ticketQuantity = bookings.getTicketQuantity();

                BigDecimal totalAmountPaid = new BigDecimal(flight.getTotalPrice()).multiply(new BigDecimal(ticketQuantity));

                DecimalFormat formatter = new DecimalFormat("#,###");

                String body = "<!DOCTYPE html>\n" +
                        "<html>\n" +
                        "<head>\n" +
                        "    <style>\n" +
                        "        body {\n" +
                        "            font-family: Arial, sans-serif;\n" +
                        "            line-height: 1.6;\n" +
                        "            color: #333;\n" +
                        "            max-width: 800px;\n" +
                        "            margin: 0 auto;\n" +
                        "            padding: 20px;\n" +
                        "            background-color: #f5f5f5;\n" +
                        "        }\n" +
                        "        .email-container {\n" +
                        "            background-color: #ffffff;\n" +
                        "            border-radius: 8px;\n" +
                        "            padding: 30px;\n" +
                        "            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n" +
                        "        }\n" +
                        "        .header {\n" +
                        "            color: #2c3e50;\n" +
                        "            border-bottom: 2px solid #3498db;\n" +
                        "            padding-bottom: 10px;\n" +
                        "            margin-bottom: 20px;\n" +
                        "        }\n" +
                        "        .section {\n" +
                        "            margin-bottom: 25px;\n" +
                        "        }\n" +
                        "        .section-title {\n" +
                        "            color: #3498db;\n" +
                        "            font-size: 18px;\n" +
                        "            font-weight: bold;\n" +
                        "            margin-bottom: 10px;\n" +
                        "        }\n" +
                        "        .booking-details {\n" +
                        "            background-color: #f8f9fa;\n" +
                        "            border-left: 4px solid #3498db;\n" +
                        "            padding: 15px;\n" +
                        "            margin: 15px 0;\n" +
                        "        }\n" +
                        "        .detail-label {\n" +
                        "            font-weight: bold;\n" +
                        "            color: #2c3e50;\n" +
                        "            min-width: 180px;\n" +
                        "            display: inline-block;\n" +
                        "        }\n" +
                        "        .highlight {\n" +
                        "            color: #e74c3c;\n" +
                        "            font-weight: bold;\n" +
                        "        }\n" +
                        "        .footer {\n" +
                        "            margin-top: 30px;\n" +
                        "            padding-top: 15px;\n" +
                        "            border-top: 1px solid #ddd;\n" +
                        "            font-size: 14px;\n" +
                        "            color: #7f8c8d;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <div class=\"email-container\">\n" +
                        "        <div class=\"header\">\n" +
                        "            <h1>Payment Confirmation</h1>\n" +
                        "        </div>\n" +
                        "        \n" +
                        "        <p>Dear <strong>" + passengerName + "</strong>,</p>\n" +
                        "        <p>We are pleased to inform you that your flight booking payment has been successfully processed!</p>\n" +
                        "        \n" +
                        "        <div class=\"section\">\n" +
                        "            <div class=\"section-title\">Booking Details</div>\n" +
                        "            <div class=\"booking-details\">\n" +
                        "                <p><span class=\"detail-label\">Booking Reference:</span> <span class=\"highlight\">" + bookings.getBookingId() + "</span></p>\n" +
                        "                <p><span class=\"detail-label\">Passenger Name:</span> " + passengerName + "</p>\n" +
                        "                <p><span class=\"detail-label\">Number of Tickets:</span> " + ticketQuantity + "</p>\n" +
                        "                <p><span class=\"detail-label\">Total Amount Paid:</span> <span class=\"highlight\">" + formatter.format(totalAmountPaid) + " VND</span></p>\n" +
                        "                <p><span class=\"detail-label\">Booking Status:</span> " + bookings.getStatus() + "</p>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "        \n" +
                        "        <div class=\"section\">\n" +
                        "            <div class=\"section-title\">Flight Information</div>\n" +
                        "            <p><span class=\"detail-label\">Airline:</span> " + flight.getAirline() + "</p>\n" +
                        "            <p><span class=\"detail-label\">Flight Number:</span> " + flight.getFlightCode() + " (" + flight.getFlightId() + ")</p>\n" +
                        "            <p><span class=\"detail-label\">Departure Date:</span> " + flight.getTakeoffDate() + "</p>\n" +
                        "            <p><span class=\"detail-label\">Departure Time:</span> " + flight.getTakeoffTime() + "</p>\n" +
                        "            <p><span class=\"detail-label\">From:</span> " + flight.getDepartureProvince().getProvinceName() + "</p>\n" +
                        "            <p><span class=\"detail-label\">Arrival Date:</span> " + flight.getLandingDate() + "</p>\n" +
                        "            <p><span class=\"detail-label\">Arrival Time:</span> " + flight.getLandingTime() + "</p>\n" +
                        "            <p><span class=\"detail-label\">To:</span> " + flight.getDestinationProvince().getProvinceName() + "</p>\n" +
                        "            <p><span class=\"detail-label\">Seat Class:</span> " + flight.getSeatClass() + "</p>\n" +
                        "        </div>\n" +
                        "        \n" +
                        "        <div class=\"section\">\n" +
                        "            <p>Please keep this email for your flight information reference. We recommend arriving at the airport early to complete check-in procedures.</p>\n" +
                        "            <p>If you have any questions or need to modify your booking, please don't hesitate to contact us at <a href=\"mailto:support@airmanagement.com\">support@airmanagement.com</a> or our support hotline <strong>1900-XXXX</strong>.</p>\n" +
                        "        </div>\n" +
                        "        \n" +
                        "        <div class=\"footer\">\n" +
                        "            <p>Thank you for choosing our service. We wish you a safe and pleasant journey!</p>\n" +
                        "            <p>Sincerely,</p>\n" +
                        "            <p><strong>The AirManagement Team</strong></p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>";

                notificationServiceInterface.sendPaymentConfirmation(toEmail, "Payment Confirmation for Booking #" + bookings.getBookingId(), body, true);

            } catch (Exception e) {
                System.err.println("Error sending payment confirmation email for booking ID " + bookings.getBookingId() + ": " + e.getMessage());
                throw new RuntimeException("Lỗi khi gửi email xác nhận thanh toán!", e);
            }

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error paying: " + e.getMessage());
        }

        return responseDTO;
    }
}
