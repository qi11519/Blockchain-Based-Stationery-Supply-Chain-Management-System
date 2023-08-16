import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link } from "react-router-dom";
import "./List.css";

const InventoryPage = () => {
  
  const { user } = useContext(UserContext);

  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventoryrecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response.ok) {
          const inventoryRecords = await response.json();
          setInventoryRecords(inventoryRecords);
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
      <div className="inventory-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
            <u><h2 style={{paddingLeft: '10px'}}>INVENTORY LIST</h2></u>
          </div>
          <div className="content">
          <div className="list">
            { isLoading ? ( // Show loading indicator while fetching
              <div className="spinner-border text-light spinner-border-order" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : inventoryRecords.length > 0 ? (
              inventoryRecords.map(inventory => (
                inventory.branch === user.user.Account_ID ? (
                  <div className="item" id="inventoryItem">
                  <p id="inventoryId">{inventory.inventoryID}</p>
                  <div style={{textAlign: 'left'}}>
                    <p id="inventoryName">{inventory.inventoryName}</p>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <h5 id="quantityText">Quantity</h5>
                      <h5 id="quantity">{inventory.inventoryQuantity}</h5>
                      <h5 id="quantityText">pcs</h5>
                    </div>
                  </div>
                  <div style={{alignItems: 'center'}}>
                      <h5 id="time">LAST UPDATED TIME</h5>
                      <h5 id="timeValue">{inventory.time}</h5>
                  </div>
                  <Link key={inventory.inventoryID} to={{pathname: `/view-inventory/${inventory.inventoryID}`}} state= {inventory} style={{ textDecoration: 'none', padding: '10px', display: 'block' }} id="updateButton" >UPDATE</Link>
                </div>
                ) : (<div></div>) 
              ))) : (
                <p>No inventory record found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default InventoryPage;
