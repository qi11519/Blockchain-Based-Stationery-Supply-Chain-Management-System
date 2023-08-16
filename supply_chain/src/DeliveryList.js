import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link } from "react-router-dom";
import "./List.css";

const DeliveryList = () => {
    
  const { user } = useContext(UserContext);

  const [deliveryRecords, setDeliveryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/deliveryrecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response.ok) {
          const deliveryRecords = await response.json();
          setDeliveryRecords(deliveryRecords);
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
      <div className="delivery-list-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
            <u><h2 style={{paddingLeft: '10px'}}>DELIVERY LIST</h2></u>
          </div>
          <div className="content">
            <div className="list">
              { isLoading ? ( // Show loading indicator while fetching
                <div className="spinner-border text-light spinner-border-order" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : deliveryRecords.length > 0 ? (
              deliveryRecords.map(delivery => (
                user.user.User_Type === "companybranch" ? (
                  delivery.branch === user.user.Account_ID ? (
                  <div className="item">
                    <p id="status" style={{backgroundColor: delivery.deliveryStatus ==='FAILED' ? 'rgb(147, 37, 37)' : null}}>{delivery.deliveryStatus}</p>
                    <p id="itemId">{delivery.deliveryID}</p>
                    <div style={{alignItems: 'center'}}>
                        <h5 id="time">LAST UPDATED</h5>
                        <h5 id="timeValue">{delivery.time}</h5>
                    </div>
                    <Link key={delivery.deliveryID} to={{pathname: `/view-delivery/${delivery.deliveryID}`}} state= {delivery} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                  </div>
                  ) : (<div></div>)
                ): user.user.User_Type === "supplier" ? (
                  delivery.supplier === user.user.Account_ID ? (
                  <div className="item">
                    <p id="status" style={{backgroundColor: delivery.deliveryStatus ==='FAILED' ? 'rgb(147, 37, 37)' : null}}>{delivery.deliveryStatus}</p>
                    <p id="itemId">{delivery.deliveryID}</p>
                    <div style={{alignItems: 'center'}}>
                        <h5 id="time">LAST UPDATED</h5>
                        <h5 id="timeValue">{delivery.time}</h5>
                    </div>
                    <Link key={delivery.deliveryID} to={{pathname: `/view-delivery/${delivery.deliveryID}`}} state= {delivery} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                  </div>
                  ) : (<div></div>)
                ) : (
                  <div className="item">
                    <p id="status" style={{backgroundColor: delivery.deliveryStatus ==='FAILED' ? 'rgb(147, 37, 37)' : null}}>{delivery.deliveryStatus}</p>
                    <p id="itemId">{delivery.deliveryID}</p>
                    <div style={{alignItems: 'center'}}>
                        <h5 id="time">LAST UPDATED</h5>
                        <h5 id="timeValue">{delivery.time}</h5>
                    </div>
                    <Link key={delivery.deliveryID} to={{pathname: `/view-delivery/${delivery.deliveryID}`}} state= {delivery} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="viewButton" >VIEW</Link>
                  </div>
              )))) : (
                <p>No delivery record found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default DeliveryList;