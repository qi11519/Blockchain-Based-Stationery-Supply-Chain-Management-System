import React, { useContext, useEffect, useState  }  from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import InputSpinner from './InputSpinner';
import { Link } from "react-router-dom";
import "./App.css";

const OrderPresetPage = () => {
  
  const { user } = useContext(UserContext);

  const [orderPreset, setOrderPreset] = useState([]);

  const [orderPresetID, setOrderPresetID] = useState();
  const [presetQuantity, setPresetQuantity] = useState();
  const [minimumLimit, setLimitQuantity] = useState();
  const [presetQuantitySpinnerValue, setPresetQuantitySpinnerValue] = useState();
  const [minimumLimitSpinnerValue, setLimitQuantitySpinnerValue] = useState();

  const handleLimitChange = (value) => {
    setLimitQuantity(value);
  };

  const handleQuantityChange = (value) => {
    setPresetQuantity(value);
  };

  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orderpreset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        
        if (response.ok) {
          const orderPreset = await response.json();
          setOrderPreset(orderPreset);

          orderPreset.forEach(preset => {
            if (preset.branch === user.user.Account_ID) {
              setOrderPresetID(preset.presetID);
              setLimitQuantity(preset.minimumLimit);
              setPresetQuantity(preset.presetQuantity);
              setLimitQuantitySpinnerValue(minimumLimitSpinnerValue);
              setPresetQuantitySpinnerValue(presetQuantitySpinnerValue);
            }
          });

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
  }, [minimumLimitSpinnerValue, presetQuantitySpinnerValue, user]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:3001/api/updateorderpreset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, orderPresetID, minimumLimit, presetQuantity })
      });
  
      if (response.ok) {
        setTimeout(() => {
          setLimitQuantity(minimumLimit);
          setPresetQuantity(presetQuantity);
          setLimitQuantitySpinnerValue(minimumLimitSpinnerValue);
          setPresetQuantitySpinnerValue(presetQuantitySpinnerValue);
          alert('Order Preset Updated Successfully');
          setIsLoading(false);
        }, 1000);
      } else {
        // Login failed
        alert('Failed to Update Order Preset');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed action');
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Set loading back to false after the request is complete
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
              <u><h2 style={{paddingLeft: '10px'}}>ORDER PRESET</h2></u>
          </div>
          <div className="content">
              <div id="infoPanel" style={{alignItems: 'center'}}>
                <p style={{color: 'grey',fontSize: '20px'}}><u>ADJUST ORDER QUANTITY</u></p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide" style={{marginRight: '30px', width:'400px'}}>ORDER QUANTITY</p>
                  { isLoading ? ( // Show loading indicator while fetching
                    <div style={{paddingLeft: '100px'}}>
                      <div className="spinner-border text-light spinner-border-order"  role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    ) : ( orderPreset.map(preset => (
                      preset.branch === user.user.Account_ID ? (
                        <div style={{marginLeft: '40px', marginRight: '-15px'}}>
                          <InputSpinner defaultValue={presetQuantity} id='minimumLimit' onChange={handleQuantityChange} />
                        </div>
                      ) : (<div></div>)
                  )))}
                </div>
                <p></p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <p id="viewLeftSide" style={{marginRight: '30px', width:'400px'}}>MINIMUM LIMIT</p>
                    { isLoading ? ( // Show loading indicator while fetching
                    <div style={{paddingLeft: '100px'}}>
                      <div className="spinner-border text-light spinner-border-order"  role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    ) : ( orderPreset.map(preset => (
                      preset.branch === user.user.Account_ID ? (
                        <div style={{marginLeft: '40px', marginRight: '-15px'}}>
                          <InputSpinner defaultValue={minimumLimit} id='presetQuantity' onChange={handleLimitChange} />
                        </div>
                      ) : (<div></div>)
                  )))}
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'200px'}}>
                { isLoading ? (
                  <div className="spinner-border text-light spinner-border-order" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                    ) : (
                  <Link style={{ textDecoration: 'none', padding: '10px', display: 'block'}} id="viewButton" onClick={handleUpdate}>
                    UPDATE
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

export default OrderPresetPage;