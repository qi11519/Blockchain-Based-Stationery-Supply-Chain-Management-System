import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link, useLocation } from "react-router-dom";
import Dropdown from './Dropdown';
import TextField from "./TextField";
import "./List.css";

let statusChange = ["IN TRANSIT", "FAILED"];

const ViewDeliveryPage = () => {

  let location = useLocation();
  const delivery = location.state;
  
  const { user } = useContext(UserContext);

///////////////////////////////////
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [useStateStatus, setUseStateStatus] = useState(false); // Add useStateStatus state

  const [currentDelivery, setDelivery] = useState(delivery);
  
  const [statusChoice, setStatusChoice] = useState();
  const [remark, setRemark] = useState();

  const handleStatusChoice = (value) => {
    setStatusChoice(value);
  };

  const handleRemarkChange = (value) => {
    setRemark(value);
  };

  const updateStatusChangeOptions = (value) => {
    if (value === "IN TRANSIT"){
        statusChange = ["SHIPPING", "FAILED"];
    } else if (value === "SHIPPING"){
        statusChange = ["COMPLETED", "FAILED"];
    } else if (value === "COMPLETED"){
        statusChange = ["IN TRANSIT", "SHIPPING", "FAILED","COMPLETED"];
    } else if (value === "FAILED"){
        statusChange = ["IN TRANSIT", "SHIPPING", "FAILED","COMPLETED"];
    }
  }

  useEffect(() => {

    updateStatusChangeOptions(currentDelivery.deliveryStatus);
    
    if (useStateStatus === false){
      setStatusChoice(statusChange[0]);
      setRemark(currentDelivery.remark);
    
      if (!delivery){
        currentDelivery.deliveryStatus = statusChoice;
        currentDelivery.remark = remark;
        updateStatusChangeOptions(currentDelivery.deliveryStatus);
        setDelivery(currentDelivery);
      } else {
        updateStatusChangeOptions(delivery.deliveryStatus);
        setRemark(delivery.remark);
      }
      setUseStateStatus(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      setStatusChoice(statusChange[0]);
    }
    
  }, [currentDelivery, delivery, remark, statusChoice, useStateStatus]);

  const handleUpdateDelivery = async () => {
    setIsLoading(true);

    try{
      const currentDeliveryID = currentDelivery.deliveryID;

      const response2 = await fetch('http://localhost:3001/api/updatedeliverystatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, currentDeliveryID, statusChoice, remark})
      });
  
      if (response2.ok) {
        const getCurrentTimestamp = () => {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
        
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        };

        setTimeout(() => {
          currentDelivery.deliveryStatus = statusChoice;
          currentDelivery.remark = remark;
          currentDelivery.time = getCurrentTimestamp();
          setDelivery(currentDelivery);
          alert("Delivery record's Status is Updated Successfully.");
          if(statusChoice === "COMPLETED"){
            alert("The Order's Status is Updated Successfully.");
            alert("The Inventory Quantity has reflected to the Company Branch Successfully.");
          } else  if(statusChoice === "FAILED"){
            alert("The Order's Status is Updated Successfully.");
          }
        }, 100);
      } else {
        alert("Failed to Update Delivery Record's Status");
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    } finally {
      setTimeout(() => {
        setUseStateStatus(false);
        setIsLoading(false); // Set loading back to false after the request is complete
      }, 100);
    }
  };
//////////////////////////////////////
  return (
    <UserContext.Provider value={user}>
        <div className="delivery-list-page" style={{display: 'flex'}}>
        <div>
            <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
            <div className="top-banner">
                <u><h2 style={{paddingLeft: '10px'}}><Link to="/view-delivery" style={{ textDecoration: 'none', color: 'white', padding: '10px', display: 'block' }} >&lt; {currentDelivery.deliveryID}</Link></h2></u>
            </div>
            <div className="content">
                <div id="deliveryInfoPanel" style={{ height:'110%'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">DELIVERY ID</p>
                        <p id="viewRightSide">{currentDelivery.deliveryID}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">ORDER ID</p>
                        <p id="viewRightSide">{currentDelivery.orderID}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">BRANCH ID</p>
                        <p id="viewRightSide">{currentDelivery.branch}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">SUPPLIER ID</p>
                        <p id="viewRightSide">{currentDelivery.supplier}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">LAST UPDATED</p>
                        <p id="viewRightSide">{currentDelivery.time}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">DESTINATION</p>
                        <p id="viewRightSide">{currentDelivery.destination}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">STATUS</p>
                        <p id="viewRightSide" style={{paddingRight:'10px', color: currentDelivery.deliveryStatus === 'FAILED' ? 'rgb(147, 37, 37)' : 'rgb(36, 172, 61)'}}>{currentDelivery.deliveryStatus}</p>
                        { user.user.User_Type === "deliverycompany" ? ( 
                            currentDelivery.deliveryStatus !== 'FAILED' ? ( // Show loading indicator while fetching
                              currentDelivery.deliveryStatus !== 'COMPLETED' ? ( // Show loading indicator while fetching
                                isLoading ? ( // Show loading indicator while fetching
                                  <div style={{paddingLeft: '100px'}}>
                                    <div className="spinner-border text-light spinner-border-order"  role="status">
                                      <span className="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                  ) : ( 
                                    <Dropdown options={statusChange}   onChange={handleStatusChoice}/>
                                  )) : ( 
                                      <div></div>
                              )) : ( 
                                  <div></div>
                          )) : ( 
                            <div></div>
                        )}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p id="deliveryViewLeftSide">REMARK</p>
                        { user.user.User_Type === "deliverycompany"  ? (
                            currentDelivery.deliveryStatus !== 'FAILED' ? (
                                currentDelivery.deliveryStatus !== 'COMPLETED' ? (
                                  isLoading ? (
                                    <div style={{marginLeft:'100px'}} className="spinner-border text-light spinner-border-order" role="status">
                                      <span className="sr-only">Loading...</span>
                                    </div>
                                    ) : (
                                    <div id="viewRightSide"><TextField defaultText={currentDelivery.remark} onChange={handleRemarkChange} /></div>
                                    )) : (
                                    <p id="viewRightSide">{currentDelivery.remark}</p>
                            )) : (
                              <p id="viewRightSide">{currentDelivery.remark}</p>
                        )) : ( 
                          <p id="viewRightSide">{currentDelivery.remark}</p>
                        )}
                    </div>
                    <div style={{alignItems: 'center'}}>
                        { user.user.User_Type === "deliverycompany"  ? (
                            currentDelivery.deliveryStatus !== 'FAILED' ? (
                                currentDelivery.deliveryStatus !== 'COMPLETED' ? (
                                  isLoading ? (
                                    <div className="spinner-border text-light spinner-border-order" role="status">
                                      <span className="sr-only">Loading...</span>
                                    </div>
                                      ) : (
                                    <button id="viewButton" onClick={handleUpdateDelivery}>UPDATE</button>
                                      )
                                    ) : ( 
                                    <div></div>
                            )) : ( 
                            <div></div>
                        )) : (
                        <div></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    </UserContext.Provider>
  );
};

export default ViewDeliveryPage;
