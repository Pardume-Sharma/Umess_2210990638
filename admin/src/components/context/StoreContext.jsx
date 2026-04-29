import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const url = import.meta.env.VITE_DB_URL; //backendURL

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data.admin);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch user profile when token changes
  useEffect(() => {
    if (token) {
      setIsLoading(true); // Start loading when token is present
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setIsLoading(false); // No token means not loading
    }
  }, [token]);

  const updateUserProfile = async (formData) => {
    try {
      const response = await axios.put(`${url}/api/admin/updateProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserProfile(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error appropriately
    }
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${url}/api/admin/password`,
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
    isLoading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
