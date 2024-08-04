import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoins, FaHome, FaMoneyBillWave, FaPlusCircle, FaRupeeSign, FaSignOutAlt } from 'react-icons/fa';
import './styles/Header.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');
    
    if (isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  return (
    <header className="header" id="main-header">
      <div className="header-title">
        <h1><FaRupeeSign/> Budget <br/> <FaCoins/> Baba /-</h1>
      </div>
      <nav className="header-nav">
        <Link to="/dashboard"><FaHome /> Dashboard</Link>
        <Link to="/income"><FaMoneyBillWave /> Income</Link>
        <Link to="/expenses"><FaMoneyBillWave /> Expenses</Link>
        <Link to="/add-transaction"><FaPlusCircle /> Add Transaction</Link>
        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </nav>
      
    </header>
  );
};

export default Header;