import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";
import { wrappedFetch } from "../../utils";

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();

  const toggleSignUp = () => setShowSignUp(!showSignUp);

  const login = async (event) => {
    event.preventDefault();

    // Logging input data to see what's being passed
    console.log("Logging in with:", email, password);

    try {
      const res = await wrappedFetch("http://localhost:8000/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Response data:", data); // Debugging response

      if (data.error) {
        // Show toast message if there's an error
        toast.error(data.error || "Incorrect credentials. Please try again.");
      } else {
        // If login is successful, store token, show success toast, and navigate
        localStorage.setItem("token", data.access_token);
        toast.success("Successful login!");
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      // General error catch for network issues or other unexpected errors
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
          <img
            className="login-left-side-img"
            src="https://your-direct-image-url.com/image.jpg"
            alt="Background"
          />
          <div className="login-left-side-bg"></div>
        </div>
        <div className="login-right-side">
          <div className="login-sign-in-container">
            <div className="login-sign-in">
              <button
                id="signin"
                className={`login-btn-header ${!showSignUp ? "active" : ""}`}
                type="button"
                onClick={() => setShowSignUp(false)}
              >
                Sign In
              </button>
            </div>
            <div className="login-sign-up">
              <Link to="/register"
                id="signup"
                className={`login-btn-header ${showSignUp ? "active" : ""}`}
              >
                Sign Up
              </Link>
            </div>

            <div
              id="signin-tab"
              className={`login-sign-up-info ${showSignUp ? "login-hidden" : ""}`}
            >
              <form onSubmit={login}>
                <div className="login-prompt-field">USERNAME</div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="login-username"
                  className="login-input-field"
                  placeholder="Enter your username"
                />
                <div className="login-prompt-field">PASSWORD</div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="login-password"
                  className="login-input-field"
                  placeholder="*************"
                />
                <button type="submit" className="signin-button">
                  SIGN IN <i className="fa fa-arrow-right" aria-hidden="true"></i>
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

export default Login;
