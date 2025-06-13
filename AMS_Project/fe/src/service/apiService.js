import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8081";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /** AUTH */
    static async registerUser(registration) {
        return axios.post(`${this.BASE_URL}/auth/register`, registration);
    }

    static async loginUser(loginDetails) {
        return axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
    }

    /** USERS */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserProfile() {
        const response = await axios.get(`${this.BASE_URL}/users/me`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}/bookings`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }
    static async updateUserProfile(userId, user) {
        const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, user, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async changeUserPassword(userId, oldPassword, newPassword) {
        const response = await axios.put(`${this.BASE_URL}/users/change-password/${userId}`, oldPassword, newPassword, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserByEmail(email) {
        const response = await axios.get(`${this.BASE_URL}/users/email`, {
            params: { email },
            headers: this.getHeader(),
        });
        return response.data;
    }

    /** FLIGHTS */
    static async addFlight(flight, departureProvinceId, destinationProvinceId) {
        const response = await axios.post(`${this.BASE_URL}/flights/add`, flight, {
            headers: this.getHeader(),
            params: {
                departure_province_id: departureProvinceId,
                destination_province_id: destinationProvinceId,
            },
        });
        return response.data;
    }

    static async getAllFlights(limit = 50, offset = 100) {
        const response = await axios.get(`${this.BASE_URL}/flights/all`, {
            headers: this.getHeader(),
            params: {
                limit: limit,
                offset: offset,
            },
        });
        return response.data;
    }

    static async getFlightById(flightId) {
        const response = await axios.get(`${this.BASE_URL}/flights/${flightId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async deleteFlight(flightId) {
        const response = await axios.delete(`${this.BASE_URL}/flights/delete/${flightId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateFlight(flightId, formData) {
        const response = await axios.put(`${this.BASE_URL}/flights/update/${flightId}`, formData, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async searchFlights(departureProvinceId, destinationProvinceId, date, sortBy = "price", sortOrder = "asc", airlines = []) {
        const response = await axios.get(`${this.BASE_URL}/flights/search`, {
            headers: this.getHeader(),
            params: {
                departure_province_id: departureProvinceId,
                destination_province_id: destinationProvinceId,
                date: date,
                sortBy: sortBy,
                sortOrder: sortOrder,
                airlines: airlines.join(","), // Send airlines as comma-separated string
            },
        });
        return response.data;
    }

    static async searchFlightsByTime(departureProvinceId, destinationProvinceId, date) {
        const response = await axios.get(`${this.BASE_URL}/flights/searchbytime`, {
            params: {
                departure_province_id: departureProvinceId,
                destination_province_id: destinationProvinceId,
                date: date,
            },
        });
        return response.data;
    }

    static async searchFlightsByTimeAndReturn(departureProvinceId, destinationProvinceId, dateCome, dateReturn) {
        const response = await axios.get(`${this.BASE_URL}/flights/searchandreturn`, {
            params: {
                departure_province_id: departureProvinceId,
                destination_province_id: destinationProvinceId,
                datecome: dateCome,
                datereturn: dateReturn,
            },
        });
        return response.data;
    }

    static async searchFlightsByTimeAndReturn2(flightId, dateReturn) {
        const response = await axios.get(`${this.BASE_URL}/flights/searchandreturn2`, {
            params: {
                flightId: flightId,
                datereturn: dateReturn,
            },
        });
        return response.data;
    }

    static async searchFlightsByDateRange(departureProvinceId, destinationProvinceId, startDate, endDate) {
        const response = await axios.get(`${this.BASE_URL}/flights/search-by-date-range`, {
            headers: this.getHeader(),
            params: {
                departure_province_id: departureProvinceId,
                destination_province_id: destinationProvinceId,
                start_date: startDate,
                end_date: endDate,
            },
        });
        return response.data;
    }

    /** BOOKINGS */
    static async bookFlight(flightId, userId, booking) {
        console.log("USER ID IS: " + userId);
        const response = await axios.post(
            `${this.BASE_URL}/bookings/book-flight/${flightId}/${userId}`,
            booking,
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async getAllBookings() {
        const response = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async cancelBooking(bookingId) {
        const response = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async deleteBooking(bookingId) {
        const response = await axios.delete(`${this.BASE_URL}/bookings/delete/${bookingId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateBooking(bookingId, booking) {
        const response = await axios.put(`${this.BASE_URL}/bookings/update/${bookingId}`, booking, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    /** PAYMENT */
    static async makePayment(payment) {
        const response = await axios.post(`${this.BASE_URL}/payment/make`, payment, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    /** AUTHENTICATION */
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        return !!localStorage.getItem("token");
    }

    static isAdmin() {
        return localStorage.getItem("role") === "ADMIN";
    }

    static isUser() {
        return localStorage.getItem("role") === "USER";
    }

    // Province
    static async getAllProvinces() {
        const response = await axios.get(`${this.BASE_URL}/provinces/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }


    static async findCheapestFlightsForTrip(departureProvinceId, destinationProvinceIds, totalDays, startDate, endDate) {
        const requestData = {
            departureProvinceId,
            destinationProvinceIds,
            totalDays,
            startDate,
            endDate,
        };
        const response = await axios.post(`${this.BASE_URL}/flights/find-cheapest-flights`, requestData, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async bookMultipleFlights(userId, bookingList) {
        const response = await axios.post(`${this.BASE_URL}/bookings/multi-booking/${userId}`, bookingList, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async changePassword(userId, oldPassword, newPassword) {
        const response = await axios.put(`${this.BASE_URL}/users/change-password/${userId}`, null, {
            headers: this.getHeader(),
            params: {
                oldPassword: oldPassword,
                newPassword: newPassword,
            },
        });
        return response.data;
    }
}