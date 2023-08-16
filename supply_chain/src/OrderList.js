import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link } from 'react-router-dom';
import "./List.css";

/*
const orders = [
  { orderID: 'OR0001', branchID: 'CB0001', inventoryID: 'IN0001', quantity: '10', orderStatus: 'REQUESTED', orderUpdateTime: '2023/01/03 11:39:23 A.M.'},
  { orderID: 'OR0002', branchID: 'CB0002', inventoryID: 'IN0002', quantity: '20', orderStatus: 'CONFIRMED', orderUpdateTime: '2023/01/04 10:18:34 A.M.'},
  { orderID: 'OR0003', branchID: 'CB0003', inventoryID: 'IN0003', quantity: '30', orderStatus: 'DECLINED', orderUpdateTime: '2023/01/07 01:50:58 A.M.'},
  { orderID: 'OR0004', branchID: 'CB0004', inventoryID: 'IN0004', quantity: '40', orderStatus: 'APPROVED', orderUpdateTime: '2023/01/09 04:12:01 P.M.'},
  { orderID: 'OR0005', branchID: 'CB0005', inventoryID: 'IN0005', quantity: '50', orderStatus: 'REQUESTED', orderUpdateTime: '2023/01/11 05:04:06 A.M.'},
];
*/

const OrderList = () => {

  const { user } = useContext(UserContext);
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response.ok) {
          const orders = await response.json();
          setOrders(orders);
        } else {
          console.error('Failed to fetch orders:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false); // Set isLoading to false after fetching is done
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <div className="order-list-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
          <u><h2 style={{paddingLeft: '10px'}}>ORDER LIST</h2></u>
            { user.user.User_Type === "companybranch" ? ( // Show loading indicator while fetching
              <Link id="addButton" to='/view-order/add-order'>Add Order</Link>
            ) : ( 
            <div></div>
          )}
          </div>
          <div className="content">
            <div className="list">
            { isLoading ? ( // Show loading indicator while fetching
              <div className="spinner-border text-light spinner-border-order" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : orders.length > 0 ? (
              orders.map(order => (
                user.user.User_Type === "companybranch" ? (
                  order.branch === user.user.Account_ID ? (
                  <div className="item">
                    <p id="status" style={{backgroundColor: order.orderStatus === 'DECLINED' || order.orderStatus === 'REJECTED' || order.orderStatus === 'FAILED' ? 'rgb(147, 37, 37)' : null}}>{order.orderStatus}</p>
                    <p id="itemId">{order.orderID}</p>
                    <div style={{alignItems: 'center'}}>
                        <h5 id="time">LAST UPDATED</h5>
                        <h5 id="timeValue">{order.time}</h5>
                    </div>
                    <Link key={order.orderID} to={{pathname: `/view-order/${order.orderID}`}} state= {order} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                  </div>
                ) : (<div></div>)
              ): user.user.User_Type === "supplier" ? (
                order.supplier === user.user.Account_ID ? (
                <div className="item">
                  <p id="status" style={{backgroundColor: order.orderStatus === 'DECLINED' || order.orderStatus === 'REJECTED' || order.orderStatus === 'FAILED' ? 'rgb(147, 37, 37)' : null}}>{order.orderStatus}</p>
                  <p id="itemId">{order.orderID}</p>
                  <div style={{alignItems: 'center'}}>
                      <h5 id="time">TIME</h5>
                      <h5 id="timeValue">{order.time}</h5>
                  </div>
                  <Link key={order.orderID} to={{pathname: `/view-order/${order.orderID}`}} state= {order} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                </div>
                ) : (<div></div>)
              ) : (
                <div className="item">
                  <p id="status" style={{backgroundColor: order.orderStatus === 'DECLINED' || order.orderStatus === 'REJECTED' || order.orderStatus === 'FAILED' ? 'rgb(147, 37, 37)' : null}}>{order.orderStatus}</p>
                  <p id="itemId">{order.orderID}</p>
                  <div style={{alignItems: 'center'}}>
                      <h5 id="time">TIME</h5>
                      <h5 id="timeValue">{order.time}</h5>
                  </div>
                  <Link key={order.orderID} to={{pathname: `/view-order/${order.orderID}`}} state= {order} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                </div>
              )))) : (
                <p>No orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default OrderList;
