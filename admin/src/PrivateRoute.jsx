import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "./components/context/StoreContext.jsx";

const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { userProfile, isLoading } = useContext(StoreContext);

  const navigateToNewPort = () => {
    window.location.href = "https://testing-nine-ecru.vercel.app/";
  };

  const Spinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (userProfile && userProfile.role === "Faculty") {
    navigateToNewPort();
    return null; 
  }

  if (userProfile && requiredRoles.includes(userProfile.role) && userProfile.status) {
    return element;
  }
  else  
    return <Navigate to="/error" />;
};

export default PrivateRoute;
