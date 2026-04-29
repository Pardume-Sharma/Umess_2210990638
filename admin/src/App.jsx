import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import './index.css';
import DashBoard from './pages/DashBoard/DashBoard.jsx';
import { Route, Routes } from 'react-router-dom';
import Reviews from './pages/Reviews/Reviews.jsx';
import Notice from './pages/Notice/Notice.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Reports from './pages/Reports/Reports.jsx';
import FoodGraph from './pages/FoodGraph/FoodGraph.jsx';
import MessMenu from './pages/MessMenu/MessMenu.jsx';
import NewBookings from './pages/NewBookings/NewBookings.jsx';
import NewAdmins from './pages/NewAdmins/NewAdmins.jsx';
import Profile from './pages/Profile/Profile.jsx';
import AdminLogin from './pages/AdminLogin/AdminLogin.jsx';
import StoreContextProvider from './components/context/StoreContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Error from './pages/Error/Error.jsx';  

const App = () => {
  return (
    <StoreContextProvider>
      <ToastContainer />
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/error" element={<Error />} />
        <Route path="/admin" element={<PrivateRoute element={<DashBoard />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/reviews' element={<PrivateRoute element={<Reviews />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/graph' element={<PrivateRoute element={<FoodGraph />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/reports' element={<PrivateRoute element={<Reports />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/notice' element={<PrivateRoute element={<Notice />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/messMenu' element={<PrivateRoute element={<MessMenu />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/bookings' element={<PrivateRoute element={<NewBookings />} requiredRoles={['superadmin', 'admin']} />} />
        <Route path='/newAdmins' element={<PrivateRoute element={<NewAdmins />} requiredRoles={['superadmin']} />} />
        <Route path='/admin/profile' element={<Profile />} />
      </Routes>
    </StoreContextProvider>
  );
};

export default App;
