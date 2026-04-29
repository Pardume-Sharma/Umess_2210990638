// DashBoard.js

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format } from "date-fns";
import ClipLoader from "react-spinners/ClipLoader";
import "./DashBoard.css";
import { Button, TextField, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar/Sidebar";
import { StoreContext } from "../../components/context/StoreContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DashBoard = () => {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {url} = useContext(StoreContext);
  const [selectedHostels, setSelectedHostels] = useState([]);

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);

  const handleSelectedHostelsChange = (newHostels) => {
    setSelectedHostels(newHostels);
  };

  const handleSelectedGendersChange = (newGenders) => {
    setSelectedGenders(newGenders);
  };

  const handleSelectedFloorsChange = (newFloors) => {
    setSelectedFloors(newFloors);
  };

  const todaysDate = format(new Date(), "yyyy-MM-dd");
  const [countError, setCountError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0); // State for total users

  const [rollNumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [studentFound, setStudentFound] = useState(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(`${url}/api/user/totalUsers`);
        if (response.data) {
          setTotalUsers(response.data.totalUsers);
        } else {
          setCountError("Failed to fetch total user count.");
        }
      } catch (err) {
        console.error("Error fetching total user count: ", err);
        setCountError("Error fetching total user count.");
      }
    };

    fetchTotalUsers();
    console.log(totalUsers);
  }, [url]);

  const fetchUserByRollNumber = async (rollNumber) => {
    try {
      const response = await axios.get(
        `${url}/api/profileByRollNumber/${rollNumber}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student data", error);
      setStudentFound(false);
      throw new Error("Error fetching student data");
    }
  };

  const handleSearchByRollNumber = async () => {
    if (!rollNumber.trim()) {
      alert("Enter Roll Number");
      setSearchError("Roll Number is empty");
      return;
    }

    try {
      const user = await fetchUserByRollNumber(rollNumber.trim());
      if (user) {
        setStudentData(user);
        setSearchError(null);
        setStudentFound(true);
      } else {
        setSearchError("Student not found");
        setStudentFound(false);
      }
    } catch (error) {
      setSearchError(error.message);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(`${url}/api/reports/generateReport`, {
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log("Selected Hostels:", selectedHostels);
      console.log("Selected Genders:", selectedGenders);
      console.log("Selected Floors:", selectedFloors);
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/meal/stats`, {
          params: {
            hostels: selectedHostels,
            genders: selectedGenders,
            floors: selectedFloors,
          },
        });
        if (response.data.success) {
          console.log("mealStats:", response.data.mealStats);
          setMealData(response.data.mealStats);
        } else {
          setError("Failed to fetch meal data.");
        }
      } catch (err) {
        console.error("Error fetching meal data: ", err);
        setError("Error fetching meal data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedHostels, selectedGenders, selectedFloors, url]);

  const breakfast = mealData?.breakfast || 0;
  const lunch = mealData?.lunch || 0;
  const snacks = mealData?.snacks || 0;
  const dinner = mealData?.dinner || 0;
  const chartData = {
    labels: ["Breakfast", "Lunch", "Snacks", "Dinner"],
    datasets: [
      {
        label: "Number of Students",
        data: [breakfast, lunch, snacks, dinner],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        backgroundColor: "#333",
        borderRadius: 4,
        padding: 6,
        formatter: (value) => `${value}`,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 5000,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const renderMealStatus = (mealType, status) => {
    return (
      <Button
        variant="contained"
        color={status ? "success" : "error"}
        style={{ margin: "5px", textTransform: "capitalize" }}
      >
        {mealType}: {status ? "Availed" : "Not Availed"}
      </Button>
    );
  };

  return (
    <>
      <Sidebar
        onHostelChange={handleSelectedHostelsChange}
        onGenderChange={handleSelectedGendersChange}
        onFloorChange={handleSelectedFloorsChange}
      />
      <div className="dashboard">
        <header className="dashboard-header">
          <Typography variant="h4">Dashboard</Typography>
        </header>

        <div className="dashboard-content">
          {loading ? (
            <div className="loader">
              <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="chart-container">
                <Bar
                  className="meal-chart"
                  data={chartData}
                  options={options}
                />
              </div>
              <div className="total-users">
                <h4>Total Users: {totalUsers}</h4>
              </div>
              <div className="student-search">
                <TextField
                  label="Enter Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
                <Button
                  className="btn-class"
                  variant="contained"
                  onClick={handleSearchByRollNumber}
                >
                  Search
                </Button>
                <Button
                  className="btn-class"
                  variant="contained"
                  onClick={handleGenerateReport}
                >
                  Report
                </Button>
              </div>

              {studentData && studentFound && (
                <div className="student-meal-status">
                  <Typography variant="h6">Student Meal Status</Typography>
                  <div className="meal-status-buttons">
                    {renderMealStatus("Breakfast", studentData.breakfast)}
                    {renderMealStatus("Lunch", studentData.lunch)}
                    {renderMealStatus("Snacks", studentData.snacks)}
                    {renderMealStatus("Dinner", studentData.dinner)}
                  </div>
                </div>
              )}

              {studentFound === false && (
                <p className="not-found">Student Not Found!!</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashBoard;
