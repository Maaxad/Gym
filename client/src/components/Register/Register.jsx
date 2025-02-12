import React, { useState } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [showSignUp, setShowSignUp] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const navigate = useNavigate();

    const toggleSignUp = () => setShowSignUp(!showSignUp);

     const signup = async (event) => {
        event.preventDefault();
        // ... validation

        try {
            const url = "/register"; // Relative URL, proxy will handle the rest
            console.log("Full URL:", url); // This will log the full URL *after* proxying

            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ /* ... */ }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) { // Check for 2xx status codes (success)
                const data = await res.json();
                console.log("Response data:", data); // Log the response for debugging

                if (data.token) { // Check if 'token' exists in response
                    localStorage.setItem("token", data.token);
                    toast.success("Account created!");
                    setTimeout(() => navigate("/dashboard"), 2000);
                } else {
                    toast.error(data.error || "Token missing in response"); // Handle missing token
                    console.error("Token missing:", data); // Log the full response for debugging
                }
            } else {
                const errorData = await res.json(); // Try to parse error response
                toast.error(errorData.error || `HTTP error ${res.status}`); // Display error message
                console.error("HTTP error:", res.status, errorData); // Log details
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <button className="back-button">
                <Link to="/" className="backbutton">Back</Link>
            </button>
            <div className="login-container">
                <div className="login-left-side">
                    <div className="login-left-side-bg"></div>
                </div>
                <div className="login-right-side">
                    <div className="login-sign-in-container">
                        <div className="login-sign-in">
                            <Link to="/login"
                                id="signin"
                                className={`login-btn-header ${!showSignUp ? "active" : ""}`}
                                type="button"
                                onClick={toggleSignUp}
                            >
                                Sign In
                            </Link>
                        </div>
                        <div className="login-sign-up">
                            <button
                                id="signup"
                                className={`login-btn-header ${showSignUp ? "active" : ""}`}
                                type="button"
                                onClick={() => setShowSignUp(true)}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div
                            id="signup-tab"
                            className={`login-sign-up-info ${!showSignUp ? "login-hidden" : ""}`}
                        >
                            <form onSubmit={signup}>
                                <div className="login-prompt-field">USERNAME</div>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    name="login-name"
                                    className="login-input-field"
                                    placeholder="Create a username"
                                />
                                <div className="login-prompt-field">PASSWORD</div>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    name="login-password"
                                    className="login-input-field"
                                    placeholder="*****"
                                />
                                <div className="login-prompt-field">E-MAIL</div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    name="login-email"
                                    className="login-input-field"
                                    placeholder="Enter your e-mail address"
                                />
                                <div className="login-prompt-field">AGE</div>
                                <input
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    type="number"
                                    name="age"
                                    className="login-input-field"
                                    placeholder="Age"
                                />
                                <button className="login-btn-signup" type="submit">
                                    CREATE ACCOUNT <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Register;
