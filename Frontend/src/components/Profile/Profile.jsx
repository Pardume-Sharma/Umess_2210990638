import { useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext.jsx";
import "./Profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { userProfile, updateUserProfile, changeUserPassword } =
    useContext(StoreContext);
  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem("mode") === "dark"
  // );
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    hostel: userProfile?.hostel || "",
    roomNumber: userProfile?.roomNumber || "",
  });

  const [avatarImage, setAvatarImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatarImage(e.target.files[0]);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    await updateUserProfile(formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword === passwordData.confirmNewPassword) {
      try {
        const response = await changeUserPassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
        if (response) {
          toast.success(response.message || "Password changed successfully!");
          setIsChangingPassword(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        } else {
          toast.error(response.message || "Failed to change password.");
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      alert("Password do not match");
      toast.error("Passwords do not match.");
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // const toggleDarkMode = () => {
  //   setDarkMode((prevMode) => {
  //     const newMode = !prevMode;
  //     const body = document.querySelector("body");
  //     body.classList.toggle("dark-mode", darkMode);
  //     setMode(newMode);
  //     return newMode;
  //   });
  // };

  return (
    <div className="profile-container">
      <div className="profile-card">
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
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>
              <p>
                <strong>Roll Number:</strong> {userProfile.rollNumber}
              </p>
              <p>
                <strong>Hostel:</strong> {userProfile.hostel}
              </p>
              <p>
                <strong>Room Number:</strong> {userProfile.roomNumber}
              </p>
              <p>
                <strong>Joined At:</strong>{" "}
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
              {/* <div className="mode" onClick={toggleDarkMode}>
                <div className={`ball ${darkMode ? "right-ball" : ""}`}></div>
              </div> */}
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
            <label>Avatar Image</label>
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
