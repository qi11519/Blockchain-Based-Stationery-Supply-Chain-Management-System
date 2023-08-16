import React, { useState, useContext } from "react";
import UserContext from './UserContext';
import NavigationPanel from "./NavigationPanel";
import { Link } from "react-router-dom";
import "./App.css";

const TrackOrderPage = () => {

  const [value, setValue] = useState('');
  
  const { user } = useContext(UserContext);

  return (
    <UserContext.Provider value={user}>
      <div className="track-order-page" style={{display: 'flex'}}>
        <div>
          <NavigationPanel />
        </div>
        <div style={{width:'100%', height: '100vh'}}>
          <div className="top-banner">
              <u><h2 style={{paddingLeft: '10px'}}>TRACK ORDER</h2></u>
          </div>
          <div className="content">
              <div id="infoPanel" style={{alignItems: 'center'}}>
                <p style={{color: 'grey',fontSize: '20px'}}><u>TRACK ORDER</u></p>
                <p></p>
                <div style={{alignItems: 'center', justifyContent: 'center'}}>
                  <input style={{ textDecoration: 'none', width: '400px', fontSize:'25px', paddingLeft: '30px', paddingRight: '30px', border:'0', borderRadius:'400px'}} type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'200px'}}>
                  <Link style={{ textDecoration: 'none', padding: '10px', width: '200px', display: 'block', fontSize:'20px'}} id="viewButton" >SEARCH ORDER</Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default TrackOrderPage;