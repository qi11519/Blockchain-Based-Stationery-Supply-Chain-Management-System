import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import UserContext from './UserContext';
import "./NavigationPanel.css";
import { useNavigate} from "react-router-dom";

const NavigationPanel = () => {
  let navigate = useNavigate(); 

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    // Simulating a delay for the logout process
    setTimeout(() => {
      setLoading(false);
      let path = "/";
      navigate(path);
    }, 1000);
  };

  return (

    <div className="navPanel" style={{ backgroundColor: '#192841', color: 'white', width: '200px', height: '100%', display: 'inline-block', left: 0 }}>
      
      <h5 style={{ padding: '10px' }}>Current User</h5>

      <h5 style={{ margin: '10px', paddingTop: '10px', paddingBottom: '10px', color: 'black', backgroundColor: 'white' }}>{user?.Account_ID}</h5>
      
      {user?.User_Type === 'companybranch' && (
        <div>
          <Link className="nav-option" to="/view-order" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Order</Link>

          <Link className="nav-option" to="/view-delivery" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Delivery</Link>
      
          <Link className="nav-option" to="/view-inventory" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Inventory</Link>
      
          <Link className="nav-option" to="/order-preset" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Order Preset</Link>
        </div>
      )}

      {user?.User_Type === 'stationerycompany' && (
        <div>
          <Link className="nav-option" to="/view-order" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Order</Link>

          <Link className="nav-option" to="/view-delivery" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Delivery</Link>
        </div>
      )}

      {user?.User_Type === 'supplier' && (
        <div>
          <Link className="nav-option" to="/view-order" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Order</Link>

          <Link className="nav-option" to="/view-delivery" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Delivery</Link>
        </div>
      )}

      {user?.User_Type === 'deliverycompany' && (
        <div>
          <Link className="nav-option" to="/view-delivery" style={{ textDecoration: 'none', padding: '10px', display: 'block' }}>Delivery</Link>
        </div>
      )}

      <button
        className="logout-option"
        onClick={handleLogout}
        style={{
          textDecoration: 'none',
          padding: '10px',
          display: 'block',
          width: '100%',
          color: 'white',
          border: 'none',
          borderRadius: '0',
          textAlign: 'center',
        }}>

        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          'Logout'
        )}
      </button>

    </div>
  );
};

export default NavigationPanel;
