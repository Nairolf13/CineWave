import React from 'react';
import Login from '../components/Login';
import Header from './partials/header';
import Footer from './partials/footer';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-16">
        <Login />
        
        <div className="mt-10 mb-16 text-center">
          <h2 className="text-2xl text-white mb-4">Pas encore inscrit ?</h2>
          <p className="text-gray-400 mb-6">Rejoignez CINEWAVE et accédez à des milliers de films et séries.</p>
          
          <Button 
            variant="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Créer un compte gratuit
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
