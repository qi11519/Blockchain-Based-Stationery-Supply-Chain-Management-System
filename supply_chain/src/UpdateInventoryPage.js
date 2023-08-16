import React, { useContext, useEffect, useState }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import InputSpinner from './InputSpinner';
import { Link, useLocation } from "react-router-dom";
import "./App.css";
import "./List.css";

let allOrder = [];
let totalOrders = 0;
let prefixOrderId = "OR";

const UpdateInventoryPage = () => {

  const { user } = useContext(UserContext);

  let location = useLocation();
  const inventory = location.state;

  const handleQuantityChange = (value) => {
    setInventoryUpdateValue(value);
  };

  const [inventoryID, setInventoryID] = useState();
  const [inventoryName, setInventoryName] = useState();
  const [InventoryQuantity, setInventoryQuantity] = useState();
  const [InventoryUpdateValue, setInventoryUpdateValue] = useState();

  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [useStateStatus, setUseStateStatus] = useState(false); // Add useStateStatus state

  
  useEffect(() => {
    if (useStateStatus === false){
      if (inventory){
        setInventoryID(inventory.inventoryID);
        setInventoryName(inventory.inventoryName);
        setInventoryQuantity(inventory.inventoryQuantity);
        setInventoryUpdateValue(inventory.inventoryQuantity);
      }
    
      //console.log(useStateStatus);
      setUseStateStatus(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
    }
    
  }, [InventoryUpdateValue, inventory, useStateStatus]);

  const handleUpdate = async () => {
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
        alert('Failed to Add New Order.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    }

    try {
      const response = await fetch('http://localhost:3001/api/updateinventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, inventoryID, InventoryUpdateValue, prefixOrderId})
      });
      
      if (response.ok) {
          setInventoryID(inventoryID);
          setInventoryName(inventoryName);
          setInventoryQuantity(InventoryUpdateValue);
          setInventoryUpdateValue(InventoryUpdateValue);
          alert('Inventory Updated Successfully.');

          const responseJSON = await response.json();
          if(responseJSON.result2) {
            alert('New Order has Commited Successfully Due to Low Stock.');
          }
      } else {
        // Login failed
        alert('Failed to Update Inventory.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    } finally {
      setTimeout(() => {
        prefixOrderId = "OR";
        allOrder = [];
        totalOrders = 0;
        setUseStateStatus(false);
        setIsLoading(false); // Set loading back to false after the request is complete
      }, 300);
    }
  };

  return (
    <UserContext.Provider value={user}>
      <div className="inventory-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
              <u><h2 style={{paddingLeft: '10px'}}><Link to="/view-inventory" style={{ textDecoration: 'none', color: 'white', padding: '10px', display: 'block' }} >&lt; {inventoryID}</Link></h2></u>
          </div>
          <div className="content">
            <div id="infoPanel" style={{alignItems: 'center'}}>
              <p style={{color: 'grey', fontSize: '35px'}}><u>UPDATE INVENTORY</u></p>
              <p style={{marginRight: '30px', textAlign: 'center',fontSize: '30px', fontWeight: 'bold'}}>{inventoryName}</p>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <p id="viewLeftSide" style={{marginRight: '30px', width:'300px', textAlign: 'center',fontSize: '30px', paddingTop: '10px'}}>INVENTORY ID</p>
              <p style={{marginRight: '30px', width:'200px', textAlign: 'center',fontSize: '30px', paddingTop: '10px'}}>{inventoryID}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <p id="viewLeftSide" style={{marginRight: '30px', width:'200px', textAlign: 'center',fontSize: '35px', paddingTop: '10px'}}>QUANTITY REMAINING</p>
                  { isLoading ? ( // Show loading indicator while fetching
                    <div style={{marginLeft: '220px'}}>
                      <div className="spinner-border text-light spinner-border-order"  role="status" style={{marginLeft: '-160px'}}>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    ) : ( 
                      <div style={{marginLeft: '40px', marginRight: '-15px'}}>
                        <InputSpinner defaultValue={InventoryQuantity} id='inventoryQuantityInput' onChange={handleQuantityChange} />
                      </div>
                  )}
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'200px'}}>
                { isLoading ? (
                  <div className="spinner-border text-light spinner-border-order" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  ) : (
                    <Link style={{ textDecoration: 'none', padding: '15px', display: 'block', fontSize:'20px', width:'300px'}} id="viewButton" onClick={handleUpdate}>
                    UPADTE INVENTORY
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

export default UpdateInventoryPage;