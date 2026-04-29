import Notice from '../models/noticeModel.js';

// Create a new notice
export const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;
    const newNotice = new Notice({ title, message });
    await newNotice.save();
    res.status(201).json({ message: 'Notice created successfully.' });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};
