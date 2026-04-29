import { useState, useEffect,useContext } from "react";
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
import "./FoodGraph.css";
import { StoreContext } from "../../components/context/StoreContext";

// Register the components for Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const FoodGraph = () => {
  const {url} = useContext(StoreContext); 
  const [wastage, setWastage] = useState("");
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/wastage/getWastageData`);
        if (Array.isArray(response.data)) {
          setDataPoints(response.data);
          console.log("Response from backend",response.data);
          console.log("Data points on frontend state:", dataPoints);
        } else {
          console.error("API response is not an array", response.data);
          setDataPoints([]);
          setError("Invalid data format received from server.");
        }
      } catch (error) {
        console.error("Error fetching wastage data", error);
        setError("Failed to fetch wastage data.");
      }
    };
    fetchData();
  }, [url]); 

  const handleInputChange = (e) => {
    setWastage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wastage) {
      const newDataPoint = { value: parseFloat(wastage) };
      try {
        await axios.post(`${url}/api/wastage/addWastageData`, newDataPoint);
        setDataPoints((prevData) => [...prevData, newDataPoint]); // Add new data point
        setWastage(""); // Reset input
      } catch (error) {
        console.error("Error adding wastage data", error);
        setError("Failed to add wastage data.");
      }
    }
  };

  // Handle clearing the graph data
  const handleClearGraph = async () => {
    try {
      await axios.delete(`${url}/api/wastage/clearWastageData`);
      setDataPoints([]); // Clear the graph data
    } catch (error) {
      console.error("Error clearing wastage data", error);
      setError("Failed to clear wastage data.");
    }
  };

  const labels = dataPoints.map((point, index) => `${index + 1}`);
  const dataValues = dataPoints 

  const chartData = {
    labels: labels,
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Food Wastage',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Wastage (kg)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Entries',
        },
      },
    },
  };

  return (
    <div className="food-graph-container">
      <h2>Food Wastage Graph</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="food-form" onSubmit={handleSubmit}>
        <input
          type="number"
          value={wastage}
          onChange={handleInputChange}
          placeholder="Enter food wastage in kg"
          required
          min="0"
        />
        <button type="submit">Add Wastage</button>
        <button type="button" onClick={handleClearGraph} className="clear-button">
          Clear Graph
        </button>
      </form>
      <div className="chart">
        {dataPoints.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>No data available to display the chart.</p>
        )}
      </div>
    </div>
  );
};

export default FoodGraph;
