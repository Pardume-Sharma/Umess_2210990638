import { useState, useEffect,useContext } from "react";
import axios from "axios";
// import { FaTrash } from "react-icons/fa";
import "./Notice.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";

const Notice = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  const {url} = useContext(StoreContext);
  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${url}/api/notice/getAllNotices`);
      setNotices(response.data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newNotice = { title, message };
      await axios.post(`${url}/api/notice/createNotice`, newNotice);
      fetchNotices();
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/notice/deleteNotice/${id}`);
      console.log(response.data);
      fetchNotices(); // Refresh notices after deletion
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
      <div className="notice-container">
        <h2>Admin Notice Board</h2>

        <form className="notice-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Notice Title"
              required
            />
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Notice Message"
              required
            />
          </div>

          <button type="submit" className="btn-submit btn-class">
            Submit Notice
          </button>
        </form>
      </div>
      <div className="notices-grid">
        {notices.map((notice) => (
          <div key={notice._id} className="notice-item">
            <div className="notice-content">
              <h4>{notice.title}</h4>
              <p>{notice.message}</p>
            </div>
            <img
              src={assets.cross_icon}
              className="delete-icon"
              onClick={() => handleDelete(notice._id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Notice;
