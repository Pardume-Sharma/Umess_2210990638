import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Loginpop_up/Login';
import './index.css';
import Home from './Pages/Home/Home';
import Profile from './components/Profile/Profile'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <Login setShowLogin={setShowLogin}/> : null}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
