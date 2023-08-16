import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import Dropdown from './Dropdown';
import TextField from './TextField';
import { Link } from "react-router-dom";
import "./App.css";

let inventoryOptions = [];
let allOrder = [];
let totalOrders = 0;
let prefixOrderId = "OR";

const AddOrderPage = () => {

  const { user } = useContext(UserContext);

  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [inventoryChoice, setInventoryChoice] = useState();
  const [remark, setRemark] = useState();

  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [useStateStatus, setUseStateStatus] = useState(false); // Add useStateStatus state

  const handleInventoryChoice = (value) => {
    setInventoryChoice(value);
  };

  const handleRemarkChange = (value) => {
    setRemark(value);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventoryrecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response.ok) {
          const inventoryRecords = await response.json();
          setInventoryRecords(inventoryRecords);

          inventoryRecords.forEach(inventory => {
            if (inventory.branch === user.user.Account_ID) {
              if (!inventoryOptions.includes(inventory.inventoryID)){
                inventoryOptions.push(inventory.inventoryID)
              }
            }
          });

        } else {
          console.error('Failed to fetch inventory:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        if (useStateStatus === false){
          setUseStateStatus(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }
      }
    };

    fetchInventory();
    setInventoryChoice(inventoryOptions[0]);
    setRemark("-");
  }, [inventoryRecords, setInventoryRecords, useStateStatus, user]);

  const handleAddOrder = async () => {
    setIsLoading(true);
    
    try{
      const response1 = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      
      if (response1.ok) {
        const orders = await response1.json();

        orders.forEach(order => {
          if (!allOrder.includes(order.orderID)){
            allOrder.push(order.inventoryID)
            totalOrders += 1;
          }
        });

        totalOrders += 1;
        if (totalOrders > 9 ){
          prefixOrderId += "00" + totalOrders;
        } else if (totalOrders > 99 ){
          prefixOrderId += "0" + totalOrders;
        } else if (totalOrders > 999 ){
          prefixOrderId += totalOrders;
        } else {
          prefixOrderId += "000" + totalOrders;
        }
      } else {
        alert('Failed to Add New Order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    }

    try{
      const response2 = await fetch('http://localhost:3001/api/addorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, inventoryChoice, remark, prefixOrderId})
      });
  
      if (response2.ok) {
        setTimeout(() => {
          alert('New Order is Added Successfully');
        }, 100);
      } else {
        alert('Failed to Add New Order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    } finally {
      setTimeout(() => {
        setUseStateStatus(false);
        setIsLoading(false); // Set loading back to false after the request is complete
        prefixOrderId = "OR";
        allOrder = [];
        totalOrders = 0;
        setRemark("-");
      }, 100);
    }
  };

  return (
    <UserContext.Provider value={user}>
      <div className="order-preset-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
              <u><h2 style={{paddingLeft: '10px'}}><Link to="/view-order" style={{ textDecoration: 'none', color: 'white', padding: '10px', display: 'block' }} >&lt; ADD NEW ORDER</Link></h2></u>
          </div>
          <div className="content">
            <div id="infoPanel" style={{alignItems: 'center'}}>
              <p style={{color: 'grey',fontSize: '20px'}}><u>ADD NEW STATIONERY ORDER</u></p>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p id="viewLeftSide" style={{marginRight: '30px', width:'200px', textAlign: 'center', paddingTop:'10px'}}>INVENTORY</p>
                
                <div style={{display: 'flex', alignItems: 'center'}}>
                  { isLoading ? ( // Show loading indicator while fetching
                  <div style={{paddingLeft: '100px', width: '300px'}}>
                    <div className="spinner-border text-light spinner-border-order"  role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  ) : ( 
                    <Dropdown options={inventoryOptions}  onChange={handleInventoryChoice} style={{marginLeft: '30px', width: '500px'}} />
                  )}
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p id="viewLeftSide" style={{marginRight: '30px', width:'200px', textAlign: 'center', paddingTop:'10px'}}>REMARK</p>
                { isLoading ?  (
                    <div style={{marginLeft: '260px'}}>
                      <div className="spinner-border text-light  spinner-border-order" role="status" style={{marginLeft: '-160px'}}>
                        <span className="sr-only" >Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div><TextField defaultText= "-" onChange={handleRemarkChange}/></div>
                  )}
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'200px'}}>
              {isLoading ? (
                <div className="spinner-border text-light spinner-border-order" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                  ) : (
                <Link style={{ textDecoration: 'none', padding: '15px', display: 'block', fontSize:'20px', width:'300px'}} id="viewButton" onClick={handleAddOrder}>
                    ADD ORDER
                  </Link>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default AddOrderPage;