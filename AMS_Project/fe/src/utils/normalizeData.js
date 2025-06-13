export const normalizeUser = (userData) => ({
    email: userData?.email || userData?.username || "N/A",
    phone: userData?.phone || userData?.phoneNumber || "N/A",
  });
  
  export const normalizeFlight = (flightData, fallbackParams) => {
    const { price, flightId, departure, destination, adult } = fallbackParams;
    return {
      flightId: flightData?.id || flightData?.flightId || flightId || `flight-${Math.random()}`,
      departureCity: flightData?.departureProvinceId || flightData?.departure || departure || "Unknown",
      destinationCity: flightData?.destinationProvinceId || flightData?.destination || destination || "Unknown",
      price: Number(price) || flightData?.totalPrice || flightData?.price || 7345520,
      adult: adult || "1",
      outbound: {
        departureTime: flightData?.takeoffTime || flightData?.time || "9:00 PM",
        departureAirport: flightData?.departureAirport || "SGN Tan Son Nhat International Airport",
        arrivalTime: flightData?.landingTime || flightData?.arrival || "11:05 PM",
        arrivalAirport: flightData?.destinationAirport || "HAN Noi Bai International Airport",
        duration: flightData?.duration || "2h 05m",
        airline: flightData?.airline || "Vietnam Airlines",
        flightCode: flightData?.flightCode || flightData?.code || "VN260",
        date: flightData?.date || flightData?.takeoffDate || "2025-06-21",
      },
      return: flightData?.return
        ? {
            departureTime: flightData.return.takeoffTime || flightData.return.time || "11:30 PM",
            departureAirport: flightData.return.departureAirport || "HAN Noi Bai International Airport",
            arrivalTime: flightData.return.landingTime || flightData.return.arrival || "1:40 AM",
            arrivalAirport: flightData.return.destinationAirport || "SGN Tan Son Nhat International Airport",
            duration: flightData.return.duration || "2h 10m",
            airline: flightData.return.airline || "Vietnam Airlines",
            flightCode: flightData.return.flightCode || flightData.return.code || "VN7255",
            date: flightData.return.date || flightData.return.takeoffDate || "2025-06-28",
          }
        : {
            departureTime: "Unknown",
            departureAirport: "Unknown",
            arrivalTime: "Unknown",
            arrivalAirport: "Unknown",
            duration: "Unknown",
            airline: "Unknown",
            flightCode: "Unknown",
            date: "Unknown",
          },
    };
  };