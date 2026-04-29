import { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";

const Navbar = ({ setShowLogin }) => {
  const {
    token,
    setToken,
    userProfile,
    setUserProfile,
    fetchUserProfile,
    notifications,
    setNotifications,
    fetchNotification,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(token);
  const [showDot, setShowDot] = useState(true);
  useEffect(() => {
    if (token) {
      fetchNotification(); 
    }
  }, [token]);

  useEffect(() => {
    const unread = notifications.filter(
      (notification) => !notification.read
    ).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      let profile = fetchUserProfile();
      console.log(profile);
    } else {
      setUserProfile(false);
    }
  }, [token]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowLogin(false);
    navigate("/");
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    setShowDot(false);
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <Link to="/">
            <div className="header-logo">
              <h1 className="title">
                <span>U</span>mess
              </h1>
            </div>
          </Link>
          <nav className="navbar">
            <div className="notification-bell">
              <img
                src={assets.bell_icon}
                alt="Notifications"
                onClick={toggleNotifications}
                className="bell-icon"
              />
              {unreadCount > 0 || showDot && <span className="notification-dot"></span>}
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button onClick={markAllAsRead} className="all-read">
                      Mark all as read
                    </button>
                  </div>
                  <ul className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={`notification-item ${
                            notification.read ? "" : "unread"
                          }`}
                        >
                          <div className="notice">
                            <p>{notification.title}</p>
                            <span>{notification.message}</span>
                          </div>
                          {/* {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="mark-as-read"
                            >
                              Mark read
                            </button>
                          )} */}
                        </li>
                      ))
                    ) : (
                      <li>No new notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {isAuthenticated && userProfile ? (
              <div className="navbar-profile">
                <img
                  src={userProfile.avatarImage || assets.profile_icon}
                  alt="Profile Icon"
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="user-profile-icon"
                />
                <img onClick={logout} src={assets.logout_icon} alt="Logout" />
              </div>
            ) : (
              <a className="nav-link">
                <button
                  className="btn-class"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
              </a>
            )}
          </nav>
          {/* <div className="menu-btn">
            {isAuthenticated && userProfile ? (
              <div className="navbar-profile">
                <img
                  src={userProfile.avatarImage || assets.profile_icon}
                  alt="Profile Icon"
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="user-profile-icon"
                />
                <img onClick={logout} src={assets.logout_icon} alt="Logout" />
              </div>
            ) : (
              <a className="nav-link">
                <button
                  className="btn-class"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
              </a>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
