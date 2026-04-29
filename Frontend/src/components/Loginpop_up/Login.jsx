// Login.js
import { useContext, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Ensure ToastContainer is imported
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(0);

  // Registration State
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    avatarImage: null,
    qrCodeImage: null,
    hostel: "",
    rollNumber: "",
    roomNumber: "",
    department: "",
    gender: "",
    mobile: "",
  });

  // Login State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Function to generate OTP
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp.toString());
    return otp.toString();
  };

  // Handle Forgot Password - Send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!otpEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/user/forgotPassword`, {
        email: otpEmail,
        otp: generateOTP(),
      });
      setUserEmail(otpEmail);
      toast.success(response.data.message || "OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Handle Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter your OTP.");
      return;
    }
    try {
      const response = await axios.put(`${url}/api/user/verifyOtp`, {
        email: otpEmail,
        otp: otp,
        verificationOTP: generatedOTP,
      });
      toast.success(response.data.message || "OTP verified!");
      setOtpVerified(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.put(
        `${url}/api/user/changeForgottenPassword/${userEmail}`,
        {
          newPassword,
        }
      );
      toast.success("Password changed successfully.");
      setCurrState("Login");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  // Handle Registration Form Changes
  const onRegisterChangeHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === "avatarImage" || name === "qrCodeImage") {
      setRegisterData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setRegisterData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle Login Form Changes
  const onLoginChangeHandler = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevVisibility) => !prevVisibility);
  };

  const navigateToNewPort = () => {
    window.location.href = "https://admin-umess.onrender.com" //adminURL
  };

  const generateQRCodeAndRegister = async () => {
    if (!registerData.rollNumber) {
      toast.error("Roll number is required.");
      return;
    }

    try {
      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${registerData.rollNumber}`;

      const response = await fetch(qrCodeURL);
      const blob = await response.blob();
      const fileName = `${registerData.rollNumber}_QRCode.png`;

      const qrCodeImage = new File([blob], fileName, { type: "image/png" });

      const bodyData = new FormData();
      bodyData.append("email", registerData.email);
      bodyData.append("password", registerData.password);
      bodyData.append("name", registerData.name);
      bodyData.append("avatarImage", registerData.avatarImage);
      bodyData.append("qrCodeImage", qrCodeImage);
      bodyData.append("hostel", registerData.hostel);
      bodyData.append("rollNumber", registerData.rollNumber);
      bodyData.append("roomNumber", registerData.roomNumber);
      bodyData.append("department", registerData.department);
      bodyData.append("gender", registerData.gender);
      bodyData.append("mobile", registerData.mobile);

      const newUrl = `${url}/api/user/register`;
      const responseRegister = await axios.post(newUrl, bodyData);

      if (responseRegister.data.success) {
        setToken(responseRegister.data.token);
        localStorage.setItem("token", responseRegister.data.token);

        // Send welcome email after successful registration
        await sendWelcomeEmail(registerData.email, registerData.name);

        toast.success(responseRegister.data.message);
        setCurrState("Login");
      } else {
        toast.error(responseRegister.data.message);
      }
    } catch (error) {
      console.error("Error during QR Code generation or registration:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Send Welcome Email
  const sendWelcomeEmail = async (email, name) => {
    try {
      await axios.post(`${url}/api/email/welcome`, { email, name });
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  };

  // Handle Login or Registration Submission
  const onLogin = async (event) => {
    event.preventDefault();

    if (currState === "Sign Up") {
      await generateQRCodeAndRegister();
      return;
    }

    const userLoginUrl = `${url}/api/user/login`;
    try {
      const response = await axios.post(userLoginUrl, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        localStorage.setItem("email", loginData.email);
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <form className="login-form" onSubmit={onLogin}>
          <div className="login-header">
            <h2>{currState}</h2>
            <img
              onClick={() => setShowLogin(false)}
              src={assets.cross_icon}
              className="close-icon"
              alt="Close"
            />
          </div>

          <div className="login-body">
            {currState === "Sign Up" && (
              <div className="register-form">
                <section className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      value={registerData.name}
                      onChange={onRegisterChangeHandler}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      placeholder="Enter your roll number"
                      required
                      value={registerData.rollNumber}
                      onChange={onRegisterChangeHandler}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      placeholder="Enter your Mobile Number"
                      required
                      maxLength={10}
                      value={registerData.mobile}
                      onChange={onRegisterChangeHandler}
                    />
                  </div>
                  <div className="form-group">
                    <select
                      id="gender"
                      name="gender"
                      value={registerData.gender}
                      onChange={onRegisterChangeHandler}
                      required
                    >
                      <option value="">--Select Gender--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="form-group password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="loginPassword"
                      name="password"
                      placeholder="Enter your password"
                      required
                      value={registerData.password}
                      onChange={onRegisterChangeHandler}
                    />
                    <img
                      src={assets.eye_icon}
                      className="eye-icon"
                      alt="Toggle Password Visibility"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="file"
                      id="avatarImage"
                      name="avatarImage"
                      accept="image/*"
                      onChange={onRegisterChangeHandler}
                      required
                    />
                  </div>
                </section>

                <section className="form-section">
                  <h3>Other Information</h3>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      value={registerData.email}
                      onChange={onRegisterChangeHandler}
                    />
                  </div>
                  <div className="form-group">
                    <select
                      id="hostel"
                      name="hostel"
                      value={registerData.hostel}
                      onChange={onRegisterChangeHandler}
                      required
                    >
                      <option value="">--Select Hostel--</option>
                      <option value="Armstrong">Armstrong</option>
                      <option value="Aristotle">Aristotle</option>
                      <option value="Magellan">Magellan</option>
                      <option value="Archimedes">Archimedes</option>
                      <option value="Franklin">Franklin</option>
                      <option value="Marco Polo">Marco Polo</option>
                      <option value="Vasco da Gama">Vasco da Gama</option>
                      <option value="IBN-I">IBN-I</option>
                      <option value="IBN-II">IBN-II</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      placeholder="Enter your room number"
                      required
                      value={registerData.roomNumber}
                      onChange={onRegisterChangeHandler}
                    />
                  </div>
                  <div className="form-group">
                    <select
                      id="department"
                      name="department"
                      value={registerData.department}
                      onChange={onRegisterChangeHandler}
                      required
                    >
                      <option value="">--Select Department--</option>
                      <option value="CSE">Computer Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Marine">Marine Studies</option>
                    </select>
                  </div>
                </section>
              </div>
            )}

            {currState === "Login" && (
              <div className="form-section">
                <div className="form-group">
                  <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    placeholder="Enter your email"
                    required
                    value={loginData.email}
                    onChange={onLoginChangeHandler}
                  />
                </div>
                <div className="form-group password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="loginPassword"
                    name="password"
                    placeholder="Enter your password"
                    required
                    value={loginData.password}
                    onChange={onLoginChangeHandler}
                  />
                  <img
                    src={assets.eye_icon}
                    className="eye-icon"
                    alt="Toggle Password Visibility"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
            )}

            {currState === "Login" && (
              <span
                className="forgot-password"
                onClick={() => setCurrState("Forgot Password")}
              >
                Forgot Password?
              </span>
            )}

            {currState === "Forgot Password" && (
              <div className="admin-form">
                {!otpSent && (
                  <div className="Forgot-form form-group">
                    <input
                      type="email"
                      name="otpEmail"
                      placeholder="Enter your email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="btn-class-form"
                    >
                      Send OTP
                    </button>
                  </div>
                )}
                {otpSent && !otpVerified && (
                  <div className="form-group Forgot-form">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter your OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      className="btn-class-form"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
                {otpVerified && (
                  <div className="form-group Forgot-form">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      className="btn-class-form"
                    >
                      Change Password
                    </button>
                  </div>
                )}
                <p
                  className="toggle-text alert"
                  onClick={() => setCurrState("Login")}
                >
                  Back to Login/Register
                </p>
              </div>
            )}

            {currState !== "Forgot Password" && (
              <div className="submit-button-container">
                <button type="submit" className="btn-class-form">
                  {currState === "Sign Up" ? "Sign Up" : "Login"}
                </button>
              </div>
            )}

            <div className="form-actions">
              {currState === "Login" && (
                <>
                  <p
                    className="alert"
                    onClick={() => setCurrState("Sign Up")}
                  >
                    Don't have an account? Sign Up
                  </p>
                  <span
                    className="admin-login"
                    onClick={navigateToNewPort}
                  >
                    Admin Login
                  </span>
                </>
              )}
              {(currState === "Sign Up" || currState === "Admin Login") && (
                <p className="alert" onClick={() => setCurrState("Login")}>
                  Back to Login
                </p>
              )}
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
