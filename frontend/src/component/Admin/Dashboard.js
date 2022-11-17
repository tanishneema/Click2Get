import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import { Chart as ChartJS, registerables } from 'chart.js';
// import { Chart } from 'react-chartjs-2'
// import {Lin} from 'chart.js'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { products } = useSelector((state) => state.products);
  
  const { orders } = useSelector((state) => state.allOrders);
  
  const { users } = useSelector((state) => state.allUsers);
  
  let outOfStock = 0;
  
  products &&
  products.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  });
  
  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);
  
  let totalAmount = 0;
  orders &&
  orders.forEach((item) => {
    totalAmount += item.totalPrice;
  });
  
  ChartJS.register(...registerables);
  
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [{
      label: "TOTAL AMOUNT",
      backgroundColor: ["#222831"],
      borderColor: ["#222831"],
      hoverBackgroundColor: ["rgb(197, 72, 49)"],
      data: [0, totalAmount],
      fill: {
        target: 'origin',
        below: 'rgb(255, 0, 0)',   // Area will be red above the origin
        above: '#B3FFAE'    
      },
    },
  ],
};



const doughnutState = {
  labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#F05454", "#30475E"],
        hoverBackgroundColor: ["rgb(240, 84, 84)", "#222831"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
