import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MessMenu.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../../components/context/StoreContext';

const MessMenu = () => {
  const [menu, setMenu] = useState([]);
  const [newMenu, setNewMenu] = useState({ day: '', mealType: '', menu: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const {url} = useContext(StoreContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try{
        const response = await axios.get(`${url}/api/menu/getMenu`);
        setMenu(response.data);
      }catch(error)
      {
        console.log("Failed to fetch menu ", error);
      }
    };
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenu((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddMenu = async (e) => {
    e.preventDefault();
  
    try {
      if (editMode) {
        await axios.put(`${url}/api/menu/editMenu/${editId}`, newMenu);
        setEditMode(false);
        setEditId(null);
        toast.success('Menu updated successfully!');
      } else {
        await axios.post(`${url}/api/menu/addMenu`, newMenu);
        toast.success('Menu added successfully!'); 
      }
  
      setNewMenu({ day: '', mealType: '', menu: '' }); 
  
      const response = await axios.get(`${url}/api/menu/getMenu`);
      setMenu(response.data);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || 'Menu for this day and meal type already exists!');

      } else {
        // Show general error toast for any other errors
        toast.error('An error occurred while adding the menu. Please try again.');
      }
    }
  };
  
  const handleEdit = (menuItem) => {
    setNewMenu({
      day: menuItem.day,
      mealType: menuItem.mealType,
      menu: menuItem.menu
    });
    setEditId(menuItem._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      // Delete the menu item
      await axios.delete(`${url}/api/menu/deleteMenu/${id}`);
      
      // Fetch the updated menu list
      const response = await axios.get(`${url}/api/menu/getMenu`);
      setMenu(response.data);
      
      // Show success notification for delete
      toast.success('Menu item deleted successfully!');
    } catch (error) {
      // Show error notification in case of failure
      toast.error('An error occurred while deleting the menu item. Please try again.');
    }
  };
  

  return (
    <div className="mess-menu">
      <h1 className="mess-menu__title">Mess Menu</h1>
      <form className="mess-menu__form" onSubmit={handleAddMenu}>
        <select className="mess-menu__select" name="day" value={newMenu.day} onChange={handleChange} required>
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <select className="mess-menu__select" name="mealType" value={newMenu.mealType} onChange={handleChange} required>
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Dinner">Dinner</option>
        </select>
        <input
          className="mess-menu__input"
          type="text"
          name="menu"
          value={newMenu.menu}
          onChange={handleChange}
          placeholder="Enter Menu Items"
          required
        />
        <button className="btn-class mess-menu-btn" type="submit">
          {editMode ? "Update Menu" : "Add Menu"}
        </button>
      </form>

      <table className="mess-menu__table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Meal Type</th>
            <th>Menu Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.mealType}</td>
              <td>{item.menu}</td>
              <td className='menu-btns'>
                <img className='edit-icon' src={assets.pencil_icon} onClick={() => handleEdit(item)}/>
                <button className="btn-class" onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessMenu;
