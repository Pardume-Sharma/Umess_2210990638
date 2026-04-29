import { useState, useContext } from "react";
import { StoreContext } from "../../components/context/StoreContext.jsx";
import "./Profile.css";
import { assets } from "../../assets/assets.js";
import {useNavigate} from 'react-router-dom'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  // const [userProfile, setUSerProfile] = useState(null);

  const {
    userProfile,
    updateUserProfile,
    setUserProfile,
    setToken,
    changeUserPassword,
  } = useContext(StoreContext);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [avatarImage, setAvatarImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();
  const handleAvatarChange = (e) => {
    setAvatarImage(e.target.files[0]);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserProfile(null);
    navigate("/");
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (avatarImage) formData.append("avatarImage", avatarImage);
    await updateUserProfile(formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword === passwordData.confirmNewPassword) {
      await changeUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setIsChangingPassword(false);
    } else {
      alert("Passwords do not match.");
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
      <img className="log-out" onClick={logout} src={assets.logOut} alt="Log Out"/>
        {!isEditing && !isChangingPassword && (
          <>
            <div className="card">
              <img
                src={userProfile.avatarImage}
                alt="User Avatar"
                className="avatar"
              />
            </div>
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {userProfile.name}
              </p>{" "}
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>{" "}
              <p>
                <strong>Role:</strong> {userProfile.role}
              </p>{" "}
              <p>
                <strong>Joined At:</strong>{" "}
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isChangingPassword}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>

        {isEditing && (
          <form
            onSubmit={handleProfileSubmit}
            className="edit-profile-form"
            encType="multipart/form-data"
          >
            <label>Avatar Image (optional):</label>
            <input
              type="file"
              name="avatarImage"
              onChange={handleAvatarChange}
            />
            <button type="submit" className="btn-class">
              Save Changes
            </button>
          </form>
        )}

        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          disabled={isEditing}
        >
          {isChangingPassword ? "Cancel Change Password" : "Change Password"}
        </button>

        {isChangingPassword && (
          <form
            onSubmit={handlePasswordSubmit}
            className="change-password-form"
          >
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              required
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              required
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              required
            />
            <button type="submit">Change Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
