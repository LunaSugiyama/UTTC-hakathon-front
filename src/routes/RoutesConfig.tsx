import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import ItemDetails from '../components/Item/ItemDetails';
import CreateItem from '../components/Item/CreateItem';
import LoginComponent from '../components/user/LoginComponent';
import SignupComponent from '../components/user/SignupComponent';
import Header from '../components/Header';
import EditItem from '../components/Item/EditItem';

const RoutesConfig: React.FC = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/home" element={<Home />} />
        <Route path="/item/:category/:id" element={<ItemDetails />} />
        <Route path="/item/:item_categories_name/:item_id/edit" element={<EditItem />} />
        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/item/create-item" element={<CreateItem />} />
      </Routes>
    </div>
  </Router>
);

export default RoutesConfig;
