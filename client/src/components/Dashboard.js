// src/components/Dashboard.js
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";  

import "../App.css";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
 
  return (
    <div className="d-flex">
      <div >
        <Sidebar/>
      </div>
      <div className="flex-grow-1">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
