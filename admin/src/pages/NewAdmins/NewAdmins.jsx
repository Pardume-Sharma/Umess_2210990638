import { useEffect, useState,useContext } from "react";
import axios from "axios";
import "./NewAdmins.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";

const NewAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("all");
  const {url} = useContext(StoreContext);
  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await axios.get(`${url}/api/admin/all`);
      setAdmins(res.data);
      console.log(res.data);
    };
    fetchAdmins();
  }, []);

  const toggleApproval = async (id) => {
    try {
      await axios.put(`${url}/api/admin/approve/${id}`);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === id ? { ...admin, status: !admin.status } : admin
        )
      );
    } catch (error) {
      console.error("Error updating approval status", error);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`${url}/api/admin/delete/${id}`);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error("Error deleting admin", error);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.put(`${url}/api/admin/role/${id}`, { role: newRole });
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === id ? { ...admin, role: newRole } : admin
        )
      );
    } catch (error) {
      console.error("Error updating role", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredAdmins = admins.filter((admin) => {
    if (filter === "approved") return admin.status;
    if (filter === "notApproved") return !admin.status;
    return true;
  });

  return (
    <div className="admin-list-container">
      <h1>Admin Management</h1>

      <div className="filter-container">
        <label>Filter by Status:</label>
        <select onChange={handleFilterChange} value={filter}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="notApproved">Not Approved</option>
        </select>
      </div>

      <div className="admin-grid">
        {filteredAdmins.map((admin) => (
          <>
          <div key={admin._id} className="admin-card">
            <img
              src={assets.cross_icon}
              className="delete-btn"
              onClick={() => deleteAdmin(admin._id)}
            />
            <h2>{admin.name}</h2>
            <p>ID: {admin.employeeID}</p>
            <p>Email: {admin.email}</p>
            <p>Role: {admin.role}</p>

            <label>Change Role: </label>
            <select
              value={admin.role}
              onChange={(e) => updateRole(admin._id, e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
              <option value="moderator">Moderator</option>
            </select>

            <button
              className={admin.status ? "approved" : "not-approved"}
              onClick={() => toggleApproval(admin._id)}
            >
              {admin.status ? "Approved" : "Not Approved"}
            </button>
          </div>
        </>
        ))}
      </div>
    </div>
  );
};

export default NewAdmins;
