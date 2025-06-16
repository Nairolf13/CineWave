import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Catalogue from './pages/catalogue';
import FilmDetail from './pages/film-detail';
import Watchlist from './pages/watchlist';
import Login from './pages/login';
import Register from './pages/register';
import AdminPage from './pages/admin';
import { getCurrentUser } from './utils/Auth';

const ProtectedRoute = ({ element }) => {
  const currentUser = getCurrentUser();
  console.log("État de connexion:", currentUser ? "Utilisateur connecté" : "Non connecté");
  return currentUser ? element : <Navigate to="/login" />;
};

const Router = () => {
  return (
   <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/film/:id" element={<FilmDetail />} />
      <Route path="/watchlist" element={<ProtectedRoute element={<Watchlist />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default Router;