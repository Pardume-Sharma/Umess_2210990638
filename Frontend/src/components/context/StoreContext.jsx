import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]); // Initialize with an empty array
  const url = "http://localhost:4000"; //backendURL

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch notifications
  const fetchNotification = async () => {
    try {
      const response = await axios.get(`${url}/api/notice/getAllNotices`);
      console.log("sdjdhgu",response.data.notices);
      setNotifications(response.data.notices); // Ensure that this matches your API response
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotification(); // Fetch notifications when token is available
    }
  }, [token]);

  const updateUserProfile = async (formData) => {
    try {
      const response = await axios.put(`${url}/api/user/updateProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserProfile(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${url}/api/user/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to change password.';
      throw new Error(errorMessage);
    }
  };
  
  const contextValue = {
    token,
    setToken,
    url,
    userProfile,
    setUserProfile,
    fetchUserProfile,
    updateUserProfile,
    changeUserPassword,
    notifications, // Ensure notifications are part of the context
    fetchNotification, // Correctly name the fetchNotification function
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
