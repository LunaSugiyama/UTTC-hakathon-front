import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import ItemDetails from '../components/Item/ItemDetails';
import CreateItem from '../components/Item/CreateItem';
import LoginComponent from '../components/user/LoginComponent';
import UserPage from '../components/user/UserPage';
import Header from '../components/Header';
import EditItem from '../components/Item/EditItem';
import SignupForm from '../components/user/SignupForm';
import GoogleLoginForm from '../GoogleLoginForm';
import SearchItem from '../components/Item/SearchItem';
import LoginAndRegister from '../components/LoginAndRegister';
import CurriculumPage from '../components/curriculum/EditCurriculum';

const RoutesConfig: React.FC = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<LoginAndRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="/curriculums/edit" element={<CurriculumPage />} />
        <Route path="/item" element={<SearchItem />} />
        <Route path="/item/:category/:id" element={<ItemDetails />} />
        <Route path="/item/:item_categories_name/:item_id/edit" element={<EditItem />} />
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
