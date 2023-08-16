import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link, useLocation } from "react-router-dom";
import Dropdown from './Dropdown';
import TextField from "./TextField";
import "./List.css";

let statusChange = [];
let allDelivery = [];
let totalDelivery = 0;
let prefixDeliveryId = "DR";

const ViewOrderPage = () => {

  let location = useLocation();
  const order = location.state;

  const { user } = useContext(UserContext);

  ///////////////////////////////////
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [useStateStatus, setUseStateStatus] = useState(false); // Add useStateStatus state

  const [currentOrder, setOrder] = useState(order);
  
  const [statusChoice, setStatusChoice] = useState();
  const [remark, setRemark] = useState();


  const handleStatusChoice = (value) => {
    setStatusChoice(value);
  };

  const handleRemarkChange = (value) => {
    setRemark(value);
  };

  useEffect(() => {

    if (user.user.User_Type === "stationerycompany"){
      if (!statusChange.includes("APPROVED")){
        statusChange.push("APPROVED", "REJECTED");
      }
    } else if (user.user.User_Type === "supplier"){
      if (!statusChange.includes("CONFIRMED")){
        statusChange.push("CONFIRMED", "DECLINED");
      }
    }
    setRemark(currentOrder.remark);

    if (useStateStatus === false){
      setStatusChoice(statusChange[0]);
      setRemark(currentOrder.remark);
      statusChange = [];

      if (!order){
        currentOrder.orderStatus = statusChoice;
        currentOrder.remark = remark;
        setOrder(currentOrder);
      } else {
        setRemark(order.remark);
      }

      setUseStateStatus(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

  }, [currentOrder, order, remark, statusChoice, useStateStatus, user.user.User_Type]);

  const handleUpdateOrder = async () => {
    setIsLoading(true);
    
    if (statusChoice === "CONFIRMED"){
      try{
        const response1 = await fetch('http://localhost:3001/api/deliveryrecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response1.ok) {
          const deliveryRecords = await response1.json();

          deliveryRecords.forEach(delivery => {
            if (!allDelivery.includes(delivery.deliveryID)){
              allDelivery.push(delivery.deliveryID)
              totalDelivery += 1;
            }
          });

          totalDelivery += 1;
          if (totalDelivery > 9 ){
            prefixDeliveryId += "00" + totalDelivery;
          } else if (totalDelivery > 99 ){
            prefixDeliveryId += "0" + totalDelivery;
          } else if (totalDelivery > 999 ){
            prefixDeliveryId += totalDelivery;
          } else {
            prefixDeliveryId += "000" + totalDelivery;
          }
        } else {
          alert('Failed to Add New Order');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed action');
      }
    }

    try{
      const currentOrderID = currentOrder.orderID;

      const response2 = await fetch('http://localhost:3001/api/updateorderstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, currentOrderID, statusChoice, remark, prefixDeliveryId})
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
          currentOrder.orderStatus = statusChoice;
          currentOrder.remark = remark;
          currentOrder.time = getCurrentTimestamp();
          setOrder(currentOrder);
          alert("Order's Status is Updated Successfully.");
          if(currentOrder.orderStatus === "CONFIRMED"){
            alert("New Delivery Record Has Been Issued Successfully.");
          }
        }, 100);
      } else {
        alert('Failed to Update Order Status.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    } finally {
      setTimeout(() => {
        setUseStateStatus(false);
        setIsLoading(false); // Set loading back to false after the request is complete
        prefixDeliveryId = "DR";
        allDelivery = [];
        totalDelivery = 0;
      }, 100);
    }
  };
  /////////////////////////////////


  return (
    <UserContext.Provider value={user}>
      <div className="order-list-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel user={user}/>
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
              <u><h2 style={{paddingLeft: '10px'}}><Link to="/view-order" style={{ textDecoration: 'none', color: 'white', padding: '10px', display: 'block' }} >&lt; {currentOrder.orderID}</Link></h2></u>
          </div>
          <div className="content">
            <div id="infoPanel" style={{ height:'130%'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">ORDER ID</p>
                  <p id="viewRightSide">{currentOrder.orderID}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">BRANCH ID</p>
                  <p id="viewRightSide">{currentOrder.branch}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">BRANCH ADDRESS</p>
                  <p id="viewRightSide">{currentOrder.branchAddress}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">INVENTORY</p>
                  <p id="viewRightSide">{currentOrder.inventoryID}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">SUPPLIER</p>
                  <p id="viewRightSide">{currentOrder.supplier}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">QUANTITY</p>
                  <p id="viewRightSide">{currentOrder.orderQuantity}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p id="viewLeftSide" style={{paddingLeft:'189px'}}>STATUS</p>
                <div style={{display: 'flex'}}>
                <p id="viewRightSide" style={{paddingRight:'10px',color: currentOrder.orderStatus === 'DECLINED' || order.orderStatus === 'REJECTED' || order.orderStatus === 'FAILED' ? 'rgb(147, 37, 37)' : 'rgb(36, 172, 61)'}}>
                    {currentOrder.orderStatus}
                </p>
                { user.user.User_Type === "supplier" ? ( // Show loading indicator while fetching
                    currentOrder.orderStatus === "APPROVED" ? (
                      isLoading ? (
                        <div  style={{marginLeft:'100px'}} className="spinner-border text-light spinner-border-order" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <Dropdown options={statusChange} onChange={handleStatusChoice}/>
                      )) : ( 
                        <div></div>
                      )
                  ) : ( 
                  <div></div>
                )}

                  { user.user.User_Type === "stationerycompany" ? ( // Show loading indicator while fetching
                    currentOrder.orderStatus === "REQUESTED" ? (
                      isLoading ? (
                        <div style={{marginLeft:'100px'}} className="spinner-border text-light spinner-border-order" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                      <Dropdown options={statusChange} onChange={handleStatusChoice}/>
                  )) : ( 
                    <div></div>
                  )) : ( 
                  <div></div>
                )}
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">LAST UPDATE</p>
                  <p id="viewRightSide">{currentOrder.time}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide">Remark</p>
                  { user.user.User_Type === "supplier"  ? (
                    currentOrder.orderStatus === "APPROVED" ? (
                      isLoading ? (
                        <div style={{marginLeft:'100px'}} className="spinner-border text-light spinner-border-order" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                    <div id="viewRightSide"><TextField defaultText={currentOrder.remark}  onChange={handleRemarkChange}/></div>
                  )) : (
                    <p id="viewRightSide">{currentOrder.remark}</p>
                  )) : (
                    <p/>
                  )}
                  { user.user.User_Type === "stationerycompany"  ? (
                    currentOrder.orderStatus === "REQUESTED" ? (
                      isLoading ? (
                        <div style={{marginLeft:'100px'}} className="spinner-border text-light spinner-border-order" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                      <div id="viewRightSide"><TextField defaultText={currentOrder.remark}  onChange={handleRemarkChange}/></div>
                  )) : (
                    <p id="viewRightSide">{currentOrder.remark}</p>
                  )) : (
                    <p/>
                  )}
                  { user.user.User_Type === "companybranch"  ? (
                    <p id="viewRightSide">{currentOrder.remark}</p>
                  ) : (
                    <p/>
                  )}
              </div>
              <div style={{alignItems: 'center', paddingTop:'25px'}}>
                { user.user.User_Type === "stationerycompany"  ? (
                  currentOrder.orderStatus === "REQUESTED" ? (
                    isLoading ? (
                      <div className="spinner-border text-light spinner-border-order" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                    <button id="viewButton" onClick={handleUpdateOrder} >UPDATE</button>
                )) : (
                  <div></div>
                )) : (
                  <div></div>
                )}
                { user.user.User_Type === "supplier"  ? (
                  currentOrder.orderStatus === "APPROVED" ? (
                    isLoading ? (
                      <div className="spinner-border text-light spinner-border-order" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <button id="viewButton" onClick={handleUpdateOrder} >UPDATE</button>
                    )
                  ) : (
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

export default ViewOrderPage;
