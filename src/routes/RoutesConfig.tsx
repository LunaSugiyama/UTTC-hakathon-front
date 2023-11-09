import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import ItemDetails from '../components/Item/ItemDetails';
import CreateItem from '../components/Item/CreateItem';
import LoginComponent from '../components/user/LoginComponent';
import SignupComponent from '../components/user/SignupComponent';
import UserPage from '../components/user/UserPage';
import Header from '../components/Header';
import EditItem from '../components/Item/EditItem';
import SignupForm from '../SignupForm';
import GoogleLoginForm from '../GoogleLoginForm';
import SearchItem from '../components/Item/SearchItem';

const RoutesConfig: React.FC = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/search" element={<SearchItem />} />
        <Route path="/item/:category/:id" element={<ItemDetails />} />
        <Route path="/item/:item_categories_name/:item_id/edit" element={<EditItem />} />
        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/google-login" element={<GoogleLoginForm />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/item/create-item" element={<CreateItem />} />
        <Route path="/signupform" element={<SignupForm />} />
      </Routes>
    </div>
  </Router>
);

export default RoutesConfig;
