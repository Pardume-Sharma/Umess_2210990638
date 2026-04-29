import { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./Canteen.css";
import { StoreContext } from "../context/StoreContext";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Canteen = () => {
  const { userProfile, token, url } = useContext(StoreContext);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [mealStatus, setMealStatus] = useState({
    breakfast: { availed: false, time: "" },
    lunch: { availed: false, time: "" },
    snacks: { availed: false, time: "" },
    dinner: { availed: false, time: "" },
  });
  const [menu, setMenu] = useState({
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [checkedIn, setCheckedIn] = useState(false); // State to track checked-in status

  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingWastage, setLoadingWastage] = useState(true);
  const [dataPoints, setDataPoints] = useState([]);
  const [reviewData, setReviewData] = useState({
    rollNumber: "",
    reviewText: "",
  });

  ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    if (userProfile) {
      setMealStatus({
        breakfast: {
          availed: userProfile.breakfast,
          time: userProfile.breakfastTime,
        },
        lunch: { availed: userProfile.lunch, time: userProfile.lunchTime },
        snacks: { availed: userProfile.snacks, time: userProfile.snacksTime },
        dinner: { availed: userProfile.dinner, time: userProfile.dinnerTime },
      });
    }
  }, [userProfile]);

  // Fetch the menu for the current day
  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true); // Start loading
      try {
        const currentDay = new Date().toLocaleString("en-US", {
          weekday: "long",
        });
        const response = await axios.get(`${url}/api/menu/getMenu`);
        const todayMenu = response.data.filter(
          (item) => item.day === currentDay
        );
        const menuObj = {
          breakfast:
            todayMenu.find((item) => item.mealType === "Breakfast")?.menu ||
            "No menu available",
          lunch:
            todayMenu.find((item) => item.mealType === "Lunch")?.menu ||
            "No menu available",
          snacks:
            todayMenu.find((item) => item.mealType === "Snacks")?.menu ||
            "No menu available",
          dinner:
            todayMenu.find((item) => item.mealType === "Dinner")?.menu ||
            "No menu available",
        };
        setMenu(menuObj);
      } catch (error) {
        console.error("Error fetching menu", error);
      } finally {
        setLoadingMenu(false); // Stop loading
      }
    };
    fetchMenu();
  }, []);

  // Fetch wastage data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingWastage(true); // Start loading
      try {
        const response = await axios.get(`${url}/api/wastage/getWastageData`);
        if (Array.isArray(response.data)) {
          setDataPoints(response.data);
        } else {
          console.error("API response is not an array", response.data);
          setDataPoints([]);
        }
      } catch (error) {
        console.error("Error fetching wastage data", error);
      } finally {
        setLoadingWastage(false); // Stop loading
      }
    };
    fetchData();
  }, [url]);
  const labels = dataPoints.map((point) => `${point}`);
  const dataValues = dataPoints;

  const chartData = {
    labels:labels,
    datasets: [
      {
        label: "Food Wastage (kg)",
        data: dataValues,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please Login to submit the Review");
      return;
    }

    if (userProfile.rollNumber !== reviewData.rollNumber) {
      toast.error("Roll number does not match your profile");
      return;
    }
    const completeReviewData = {
      ...reviewData,
      name: userProfile.name, 
      hostel: userProfile.hostel,
      roomNumber: userProfile.roomNumber,
      emailId: userProfile.email, 
    };

    try {
      const response = await axios.post(
        `${url}/api/review/submit`,
        completeReviewData
      );
      if (response.data.success) {
        alert("Review submitted successfully");
        setReviewData({ rollNumber: "", reviewText: "" });
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review", error);
      alert("Error submitting review");
    }
  };

  const handleQRCodeDisplay = async (mealType) => {
    if (
      !mealStatus[mealType].availed &&
      menu[mealType] !== "No menu available"
    ) {
      setShowQRCode(true);
      setQrCodeImage(userProfile.qrCodeImage); // Assuming qrCodeImage comes from userProfile

      // Update checkedIn status in the user profile
      try {
        await axios.patch(`${url}/api/user/updateCheckedInStatus`, {
          email: userProfile.email,
          checkedIn: true,
        });
        setCheckedIn(true);
      } catch (error) {
        console.error("Error updating checkedIn status", error);
      }
    }
  };
  const handleCloseQRCode = async () => {
    setShowQRCode(false);

    try {
      await axios.patch(`${url}/api/user/updateCheckedInStatus`, {
        email: userProfile.email,
        checkedIn: false,
      });
      setCheckedIn(false);
    } catch (error) {
      console.error("Error resetting checkedIn status", error);
    }
  };

  return (
    <div id="home">
      <main>
        <div id="main">
          <div className="date-time" id="dateTime"></div>
          <div className="grid-container">
            {Object.keys(mealStatus).map((mealType) => (
              <div className="mess-item" data-meal={mealType} key={mealType}>
                <h2>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
                <p className="menu-dishes">{menu[mealType]}</p>
                <button
                  className={`avail-button ${
                    mealStatus[mealType].availed ||
                    menu[mealType] === "No menu available"
                      ? "disabled"
                      : ""
                  } ${
                    !mealStatus[mealType].availed &&
                    menu[mealType] !== "No menu available" &&
                    !token
                      ? "avail-now"
                      : ""
                  }`}
                  onClick={() => handleQRCodeDisplay(mealType)}
                  disabled={
                    mealStatus[mealType].availed ||
                    menu[mealType] === "No menu available"
                  }
                >
                  {token
                    ? mealStatus[mealType].availed
                      ? "Availed"
                      : menu[mealType] === "No menu available"
                      ? "Cannot Avail"
                      : "Avail Now"
                    : "Avail Now"}
                </button>
                {mealStatus[mealType].availed && (
                  <div className="time"> at {mealStatus[mealType].time}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* <div className="menu">
          <a href="menu.jpg">
            <button className="menu-button">Check Menu 😋</button>
          </a>
        </div> */}

        {token && (
          <div className="canteen-graph-container">
            <h2>This Month's Wastage</h2>
            <div className="chart">
              {loadingWastage ? (
                <p>Loading data...</p>
              ) : (
                <Line data={chartData} />
              )}
            </div>
          </div>
        )}

        <div className="review-section">
          <h2>Leave a Review</h2>
          <form id="reviewForm" onSubmit={handleSubmit}>
            <label htmlFor="student-name">Roll Number:</label>
            <input
              type="text"
              id="student-name"
              name="rollNumber"
              value={reviewData.rollNumber}
              onChange={handleChange}
              required
            />
            <label htmlFor="reviewText">Your Review:</label>
            <textarea
              id="reviewText"
              name="reviewText"
              rows="5"
              value={reviewData.reviewText}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Submit Review</button>
          </form>
        </div>

        {showQRCode && (
          <div className="qr-popup fade-in">
            <p className="hostel-name">{userProfile.hostel}</p>
            <img src={qrCodeImage} alt="QR Code" />
            <button
              onClick={() => {
                setShowQRCode(false);
                handleCloseQRCode();
              }}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Canteen;
