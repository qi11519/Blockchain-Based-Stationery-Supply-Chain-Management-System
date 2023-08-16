import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './LoginPage';
import OrderList from './OrderList';
import DeliveryList from './DeliveryList';
import InventoryPage from './InventoryPage';
import UpdateInventoryPage from './UpdateInventoryPage';
import OrderPresetPage from './OrderPresetPage';
import ViewOrderPage from './ViewOrderPage';
import ViewDeliveryPage from './ViewDeliveryPage';
import AddOrderPage from './AddOrderPage';
import UserContext from './UserContext';
import "./App.css";

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<LoginPage setUser={setUser} />} />
            <Route path="" element={<LoginPage setUser={setUser} />} />
            <Route path="/view-order" element={<OrderList />} />
            <Route path="/view-delivery" element={<DeliveryList />} />
            <Route path="/view-inventory" element={<InventoryPage />} />
            <Route path="/view-inventory/:inventory" element={<UpdateInventoryPage />} />
            <Route path="/order-preset" element={<OrderPresetPage />} />
            <Route path="/view-order/:order" element={<ViewOrderPage/>} />
            <Route path="/view-order/add-order" element={<AddOrderPage/>} />
            <Route path="/view-delivery/:delivery" element={<ViewDeliveryPage />} />
            <Route path="/view-order/add-order" element={<AddOrderPage />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
