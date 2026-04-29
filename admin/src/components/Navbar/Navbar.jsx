// import { useState, useEffect, useContext } from "react";
// import Modal from "react-modal";
// import QrReader from "react-qr-reader"; // Using react-qr-reader for smooth scanning
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";
// import { StoreContext } from "../context/StoreContext";

// Modal.setAppElement("#root");

const Navbar = () => {
  // const [loading, setLoading] = useState(false);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [selectedMeal, setSelectedMeal] = useState("breakfast");
  // const [devices, setDevices] = useState([]);
  // const [selectedDeviceId, setSelectedDeviceId] = useState("");
  // const [manualRollNumber, setManualRollNumber] = useState("");
  // const [hasError, setHasError] = useState(false);
  // const [failedAttempts, setFailedAttempts] = useState(0);
  // const [scanCooldown, setScanCooldown] = useState(false); // To manage cooldown
  // const maxFailedAttempts = 5;
  // const { url } = useContext(StoreContext);

  // useEffect(() => {
  //   navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
  //     const videoDevices = deviceInfos.filter(
  //       (device) => device.kind === "videoinput"
  //     );
  //     setDevices(videoDevices);
  //     if (videoDevices.length > 0) {
  //       setSelectedDeviceId(videoDevices[0].deviceId);
  //     }
  //   });
  // }, []);

  // const fetchUserByRollNumber = async (rollNumber) => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/api/profileByRollNumber/${rollNumber}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching student data", error);
  //     throw new Error("Error fetching student data");
  //   }
  // };

  // const UpdateMealStatus = async (rollNumber, meal) => {
  //   try {
  //     const user = await fetchUserByRollNumber(rollNumber);
  //     if (user.selectedMeal === true) {
  //       toast.info(`${meal} already availed by ${rollNumber}.`);
  //     } else {
  //       const updateResponse = await axios.post(
  //         `${url}/api/meal/update`,
  //         {
  //           rollNumber,
  //           meal,
  //         }
  //       );
  //       if (updateResponse.data) {
  //         toast.success(
  //           `${meal} status updated successfully for ${rollNumber}`
  //         );
  //       }
  //       if (updateResponse.data.alreadyAvailed === true) {
  //         toast.info(`${meal} already availed by ${rollNumber}.`);
  //       } else {
  //         toast.error("An error occurred during meal status update.");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     setScanCooldown(true); // Start cooldown
  //     setTimeout(() => setScanCooldown(false), 5000); // Cooldown period (5 seconds)
  //   }
  // };

  // const handleScan = async (data) => {
  //   if (data && !loading && !scanCooldown) { // Block scanning during cooldown
  //     console.log("QR scanned data:", data);
  //     setLoading(true);
  //     try {
  //       await UpdateMealStatus(data, selectedMeal);
  //     } catch (error) {
  //       console.error("Error updating meal status after scan", error);
  //     } finally {
  //       setLoading(false);
  //       setFailedAttempts(0);
  //     }
  //   }
  // };

  // // Handle scan errors
  // const handleError = (error) => {
  //   console.error("QR Scan Error:", error);
  //   if (failedAttempts < maxFailedAttempts) {
  //     setFailedAttempts((prev) => prev + 1);
  //   } else if (failedAttempts >= maxFailedAttempts && !hasError) {
  //     setHasError(true);
  //     toast.error("Max attempts reached. QR scanning is disabled.");
  //   }
  // };

  // // Manual roll number update
  // const handleManualUpdate = async () => {
  //   if (manualRollNumber) {
  //     await UpdateMealStatus(manualRollNumber, selectedMeal);
  //   } else {
  //     toast.error("Please enter a roll number");
  //   }
  // };

  // // Open and close modal
  // const openModal = () => {
  //   setModalIsOpen(true);
  //   setHasError(false);
  //   setFailedAttempts(0);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  //   setManualRollNumber("");
  // };

  return (
   <>
   </>
  );
};

export default Navbar;
