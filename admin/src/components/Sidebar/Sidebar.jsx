// Sidebar.js

import "./Sidebar.css";
import { assets } from "../../assets/assets.js";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Autocomplete, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../context/StoreContext.jsx";

const Sidebar = ({ onHostelChange, onGenderChange, onFloorChange }) => {
  const navigate = useNavigate();
  
  const { token, setToken, userProfile,url } = useContext(StoreContext);

  const [sidebarActive, setSidebarActive] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [selectedHostels, setSelectedHostels] = useState([]);
  const [newHostel, setNewHostel] = useState("");
  const [showAddHostelInput, setShowAddHostelInput] = useState(false); // Toggle input field for Add Hostel
  const [showFilterOptions, setShowFilterOptions] = useState(false); // Toggle filter options
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const genderOptions = ["Male", "Female", "Others"];
  const floorOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get(
          `${url}/api/hostel/getHostels`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token if required
            },
          }
        );
        if (response.data.success) {
          const hostelNames = response.data.hostels.map((hostel) => hostel.name);
          setHostels(hostelNames);
        } else {
          toast.error("Failed to fetch hostels.");
        }
      } catch (err) {
        console.error("Error fetching hostels: ", err);
        toast.error("Error fetching hostels.");
      }
    };
    if (token) { // Fetch hostels only if token is available
      fetchHostels();
    }
  }, [token]);

  const handleAddHostel = async () => {
    if (!newHostel.trim()) {
      toast.warn("Hostel name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `${url}/api/hostel/addHostel`,
        { name: newHostel.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if required
          },
        }
      );
      if (response.data.success) {
        setHostels([...hostels, newHostel.trim()]); // Update with hostel name string
        setNewHostel("");
        toast.success("Hostel added successfully!");
      } else {
        toast.error("Failed to add hostel.");
      }
    } catch (err) {
      console.error("Error adding hostel: ", err);
      toast.error("Error adding hostel. Please try again.");
    }
  };

  const handleHostelSelection = (event, newValue) => {
    setSelectedHostels(newValue);
    onHostelChange(newValue);
  };

  const handleGenderSelection = (event, newValue) => {
    setSelectedGenders(newValue);
    onGenderChange(newValue);
  };

  const handleFloorSelection = (event, newValue) => {
    setSelectedFloors(newValue);
    onFloorChange(newValue);
  };

  return (
    <>
      {token && (
        <div className="sidebar-container">
          <div className={sidebarActive ? "sidebar active" : "sidebar"}>
            <img
              src={sidebarActive ? assets.cross_icon : assets.menu_icon}
              onClick={() => {
                setSidebarActive(!sidebarActive);
                setShowAddHostelInput(false);
                setShowFilterOptions(false);
              }}
              className="icons menu-icon"
              alt={sidebarActive ? "Close Sidebar" : "Open Sidebar"}
            />

            <div className="fields">
              {/* Dashboard Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/admin");
                }}
              >
                <img src={assets.dashboard_icon} alt="Dashboard Icon" />
                <p>DashBoard</p>
              </div>

              {/* Filters Toggle */}
              <div
                className={showFilterOptions ? "Heading active-field" : "Heading"}
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              >
                <img src={assets.Filter} className="icons" alt="Filter Icon" />
                <p>Filters</p>
              </div>

              {/* Filter Options */}
              {showFilterOptions && sidebarActive && (
                <div className="filter-options">
                  {/* Hostels Selection */}
                  <div className="filter-section">
                    <Typography variant="subtitle1" gutterBottom>
                      Select Hostels
                    </Typography>
                    <Autocomplete
                      multiple
                      options={hostels}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Hostels" placeholder="Select Hostels" />
                      )}
                      value={selectedHostels}
                      onChange={handleHostelSelection}
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="filter-section">
                    <Typography variant="subtitle1" gutterBottom>
                      Select Gender
                    </Typography>
                    <Autocomplete
                      multiple
                      options={genderOptions}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Gender" placeholder="Select Gender" />
                      )}
                      value={selectedGenders}
                      onChange={handleGenderSelection}
                    />
                  </div>

                  {/* Floor Selection */}
                  <div className="filter-section">
                    <Typography variant="subtitle1" gutterBottom>
                      Select Floor
                    </Typography>
                    <Autocomplete
                      multiple
                      options={floorOptions}
                      getOptionLabel={(option) => `Floor ${option}`}
                      renderInput={(params) => (
                        <TextField {...params} label="Floors" placeholder="Select Floors" />
                      )}
                      value={selectedFloors}
                      onChange={handleFloorSelection}
                    />
                  </div>
                </div>
              )}

              {/* Add Hostel Section */}
              <div className="add-hostel">
                <div
                  className={showAddHostelInput ? "Heading active-field" : "Heading"}
                  onClick={() => setShowAddHostelInput(!showAddHostelInput)}
                >
                  <img src={assets.add_icon} className="icons" alt="Add Icon" />
                  <p>Add Hostel</p>
                </div>

                {/* Toggle Add Hostel Input */}
                {showAddHostelInput && sidebarActive && (
                  <div className="data">
                    <TextField
                      label="Enter new hostel name"
                      value={newHostel}
                      onChange={(e) => setNewHostel(e.target.value)}
                      className="data"
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddHostel}
                      style={{ marginTop: "10px" }}
                    >
                      Add Hostel
                    </Button>
                  </div>
                )}
              </div>

              {/* Reviews Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/reviews");
                }}
              >
                <img src={assets.order_icon} alt="Reviews Icon" />
                <p>Reviews</p>
              </div>

              {/* Notice Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/notice");
                }}
              >
                <img src={assets.bell_icon} alt="Notice Icon" />
                <p>Notice</p>
              </div>

              {/* Reports Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/reports");
                }}
              >
                <img src={assets.reports_icon} alt="Reports Icon" />
                <p>Reports</p>
              </div>

              {/* Food Graph Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/graph");
                }}
              >
                <img src={assets.graph_icon} alt="Graph Icon" />
                <p>Food Graph</p>
              </div>

              {/* Mess Menu Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/messMenu");
                }}
              >
                <img src={assets.mess_menu} alt="Mess Menu Icon" />
                <p>Mess Menu</p>
              </div>

              {/* Bookings Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/bookings");
                }}
              >
                <img src={assets.parcel_icon} alt="Bookings Icon" />
                <p>Bookings</p>
              </div>

              {/* New Admins Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/newAdmins");
                }}
              >
                <img src={assets.admin_icon} alt="New Admins Icon" />
                <p>New Admins</p>
              </div>

              {/* Profile Link */}
              <div
                className="Heading"
                onClick={() => {
                  setSidebarActive(false);
                  setShowAddHostelInput(false);
                  setShowFilterOptions(false);
                  navigate("/admin/profile");
                }}
              >
                <img src={ assets.profile_image} alt="Profile Icon" />
                <p>Profile</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
