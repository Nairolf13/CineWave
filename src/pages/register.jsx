import React from 'react';
import Register from '../components/Register';
import Header from './partials/header';
import Footer from './partials/footer';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-16">
        <Register />
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
