// AdminLogin.js
import { useContext, useState } from "react";
import axios from "axios";
import "./AdminLogin.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [formData, setFormData] = useState({
    employeeID: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    avatarImage: null, // Initialize as null
  });

  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigateToNewPort = () => {
    window.location.href = "https://testing-nine-ecru.vercel.app/" // userURL
  };
  const navigate = useNavigate();
  const onChangeHandler = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "avatarImage" ? files[0] : value,
    }));
  };
  const [generatedOTP, setGeneratedOTP] = useState(0);

  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(otp.toString());
    return otp.toString();
  }

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    const apiUrl =
      currState === "Register"
        ? `${url}/api/admin/register`
        : `${url}/api/admin/login`;

    try {
      let response;

      if (currState === "Login") {
        response = await axios.post(apiUrl, {
          email: formData.email,
          password: formData.password,
        });
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value) data.append(key, value);
        });

        response = await axios.post(apiUrl, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data) {
        if (currState === "Login" && response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowAdminLogin(false);
          navigate('/admin');
        } else if (currState === "Register") {
          setCurrState("Login");
          toast.success("Registration successful! Please log in.");
        }
      } else {
        toast.error(response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!otpEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/admin/forgotPassword`, {
        email: otpEmail,
        otp: generateOTP(),
      });
      setAdminEmail(otpEmail);
      toast.success(response.data.message || "OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter your OTP.");
      return;
    }
    try {
      const response = await axios.put(`${url}/api/admin/verifyOtp`, {
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.put(`${url}/api/admin/changeForgottedPassword/${adminEmail}`, {
        newPassword,
      });
      if(response)
        toast.success("Password changed successfully.");
      setShowAdminLogin(true);
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <ToastContainer />
        {!showAdminLogin ? (
          <form className="admin-form">
            <h2>Forgot Password</h2>
            <input
              type="email"
              name="otpEmail"
              placeholder="Enter your email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              required
            />
            {otpSent && !otpVerified && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button onClick={handleVerifyOTP} className="submit-btn">
                  Verify OTP
                </button>
              </>
            )}
            {otpVerified && (
              <>
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
                  type="submit"
                  onClick={handleChangePassword}
                  className="submit-btn"
                >
                  Change Password
                </button>
              </>
            )}
            {!otpSent && (
              <button type="submit" onClick={handleForgotPassword} className="submit-btn">
                Send OTP
              </button>
            )}
            <p className="toggle-text" onClick={() => setShowAdminLogin(true)}>
              Back to Login/Register
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginOrRegister} className="admin-form">
            <h2>Admin {currState}</h2>
            {currState === "Register" && (
              <>
                <input
                  type="text"
                  name="employeeID"
                  placeholder="Employee ID"
                  value={formData.employeeID}
                  onChange={onChangeHandler}
                  required
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={onChangeHandler}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={onChangeHandler}
                  required
                />
                {/* Avatar Image Upload */}
                <div className="form-group">
                  <label htmlFor="avatarImage">Upload Avatar Image</label>
                  <input
                    type="file"
                    name="avatarImage"
                    accept="image/*"
                    onChange={onChangeHandler}
                    required
                  />
                </div>
              </>
            )}
            {currState === "Login" && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  required
                />
              </>
            )}
            <p className="toggle-text" onClick={navigateToNewPort}>
                User Login
            </p>
            <button type="submit" className="submit-btn">
              {currState === "Login" ? "Login" : "Register"}
            </button>
            <p
              className="toggle-text"
              onClick={() => setCurrState(currState === "Login" ? "Register" : "Login")}
            >
              Switch to {currState === "Login" ? "Register" : "Login"}
            </p>
            <p className="toggle-text" onClick={() => setShowAdminLogin(false)}>
              Forgot Password?
            </p>
          </form>
        )}
      </div>
    </div>
  );
};


export default AdminLogin;