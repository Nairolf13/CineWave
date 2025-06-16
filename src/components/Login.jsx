import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './button';
import { login } from '../utils/Auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      navigate('/');
    } catch (error) {
      setErrors({
        ...errors,
        general: `Échec de la connexion: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80 px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00E0FF] mb-2">Connexion</h2>
          <p className="text-gray-400">Accédez à votre compte CINEWAVE</p>
        </div>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 rounded-md">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] \${
                errors.email ? 'border border-red-500' : 'border border-zinc-700'
              }`}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-white text-sm font-medium">
                Mot de passe
              </label>
              <a href="#" className="text-sm text-[#00E0FF] hover:underline">
                Mot de passe oublié?
              </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] \${
                errors.password ? 'border border-red-500' : 'border border-zinc-700'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-[#00E0FF] rounded focus:ring-[#00E0FF] focus:ring-offset-0 bg-zinc-800 border-zinc-700"
              />
              <span className="ml-2 text-sm text-gray-300">Rester connecté</span>
            </label>
          </div>
          
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={isSubmitting}
            className="w-full mb-4"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Pas encore de compte?{' '}
              <Link to="/register" className="text-[#00E0FF] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
