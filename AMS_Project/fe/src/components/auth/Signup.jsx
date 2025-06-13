import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiService from "../../service/apiService";


const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: ""
    });


    const handleRegister = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.phone || !form.address) {
            alert("All fields are required!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await apiService.registerUser (form);
            if (response.status === 200) {
                alert(response.data.message || "Registration successful!");
                navigate('/sign-in', { replace: true });

            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.response?.data?.message || "An error occurred during registration.");
        }
    };


    return (
        <div className="signup container">
            <h2>Sign up</h2>
            <form className="form" onSubmit={handleRegister}>
                <div className="inputs">
                    <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="inputs">
                    <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="inputs">
                    <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="inputs">
                    <input type="password" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
                <div className="inputs">
                    <input type="text" placeholder="Phone Number" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="inputs">
                    <input type="text" placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Signup;