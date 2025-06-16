import React from 'react';
import { Link } from 'react-router-dom';
import Button from './button';
import { USER } from '../utils/Auth';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80 px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00E0FF] mb-2">Inscription</h2>
          <p className="text-gray-400">Créez votre compte CINEWAVE</p>
        </div>
        
        <div className="mb-6 p-4 bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-300 rounded-md">
          <h3 className="font-bold mb-2">Compte de démonstration disponible</h3>
          <p className="text-sm mb-2">Pour cette démonstration, utilisez les identifiants suivants :</p>
          <div className="bg-zinc-800 p-3 rounded text-sm font-mono">
            <div>📧 Email: <span className="text-[#00E0FF]">{USER.email}</span></div>
            <div>🔑 Mot de passe: <span className="text-[#00E0FF]">{USER.password}</span></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full bg-[#00E0FF] hover:bg-[#00c8e6] text-black font-semibold">
              Aller à la connexion
            </Button>
          </Link>
          
          <Link to="/" className="block">
            <Button variant="outline" className="w-full">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
