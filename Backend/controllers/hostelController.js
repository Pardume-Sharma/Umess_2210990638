import Hostel from "../models/hostelModel.js";

export const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({});
    res.status(200).json({ success: true, hostels });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching hostels" });
  }
};

// Add a new hostel
export const addHostel = async (req, res) => {
  const { name } = req.body;
  try {
    const newHostel = new Hostel({ name });
    await newHostel.save();
    res.status(201).json({ success: true, message: "Hostel added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding hostel" });
  }
};
