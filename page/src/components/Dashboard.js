import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql';
import Savings from './Savings';
import Header from './Header';
import './styles/Dashboard.css';

const Dashboard = () => {
  const userId = localStorage.getItem('userId');

  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userId },
    skip: !userId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const username = data?.user?.username || 'User';

  return (
    <div className="dashboard" id="main-dashboard">
      <Header title="Dashboard" />
      <div className="dashboard-content">
        <h1 className="welcome-message">Welcome, {username}</h1>
        
        <Savings userId={userId} />
      </div>
    </div>
  );
};

export default Dashboard;
