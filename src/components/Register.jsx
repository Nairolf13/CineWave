import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './button';
import { registerUser } from '../utils/UserInfo';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Le prénom est requis';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Le nom est requis';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      };
      
      console.log("Tentative d'inscription avec:", userData.email);
      
      const result = await registerUser(userData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      const storedUsers = sessionStorage.getItem('cinewave-users');
      console.log("Utilisateurs stockés après inscription:", storedUsers);
      
      console.log('Inscription réussie! Un token a été attribué:', result.user.token);
      alert(`Inscription réussie pour ${userData.email}! Vous pouvez maintenant vous connecter.`);
      
      navigate('/');
    } catch (error) {
      setErrors({
        ...errors,
        general: `Échec de l'inscription: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80 px-4">
      <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00E0FF] mb-2">Inscription</h2>
          <p className="text-gray-400">Rejoignez CINEWAVE pour accéder à des milliers de films et séries</p>
        </div>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 rounded-md">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-white text-sm font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] ${
                  errors.firstname ? 'border border-red-500' : 'border border-zinc-700'
                }`}
                placeholder="Votre prénom"
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastname" className="block text-white text-sm font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] ${
                  errors.lastname ? 'border border-red-500' : 'border border-zinc-700'
                }`}
                placeholder="Votre nom"
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] ${
                errors.email ? 'border border-red-500' : 'border border-zinc-700'
              }`}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] ${
                errors.password ? 'border border-red-500' : 'border border-zinc-700'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00E0FF] ${
                errors.confirmPassword ? 'border border-red-500' : 'border border-zinc-700'
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="mt-6">
            <label className="flex items-start">
              <input 
                type="checkbox" 
                required
                className="form-checkbox h-4 w-4 mt-1 text-[#00E0FF] rounded focus:ring-[#00E0FF] focus:ring-offset-0 bg-zinc-800 border-zinc-700"
              />
              <span className="ml-2 text-sm text-gray-300">
                J'accepte les <Link to="/terms" className="text-[#00E0FF] hover:underline">Conditions d'utilisation</Link> et la <Link to="/privacy" className="text-[#00E0FF] hover:underline">Politique de confidentialité</Link> de CINEWAVE
              </span>
            </label>
          </div>
          
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Inscription en cours...
              </div>
            ) : (
              'S\'inscrire'
            )}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-[#00E0FF] hover:underline">
                Connexion
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;