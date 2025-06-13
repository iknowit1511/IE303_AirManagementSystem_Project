import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate inputs
        if (!email || !password) {
            setError('Please fill in all required fields.');
            setLoading(false);
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });
            console.log("Login response:", response);
            if (response && response.status === 200) {
                // Save authentication data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                // See role
                console.log("Role:", response.data.role);
                // Redirect based on role if needed
                navigate('/', { replace: true });
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || 'Login failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin container">
            <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form className="form" onSubmit={handleLogin}>
                <div className="inputs">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="inputs">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className={loading ? "loading-btn" : ""}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                
                <div className="form-footer">
                    <p>Don't have an account? <span onClick={() => navigate('/sign-up')}>Sign Up</span></p>
                    <p onClick={() => navigate('/forgot-password')}>Forgot Password?</p>
                </div>
            </form>
        </div>
    );
}
export default Signin;
