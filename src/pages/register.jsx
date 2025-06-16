import React from 'react';
import RegisterComponent from '../components/RegisterComponent';
import Header from './partials/header';
import Footer from './partials/footer';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-16">
        <RegisterComponent />
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
