import { API_KEY } from './config';

export const USER = {
  id: 1,
  email: "fb_du_13@live.fr",
  password: "Florian21",
  name: "Florian Bricchi"
};

const AUTH_TOKEN_URL = 'https://api.themoviedb.org/3/authentication/token/new';

const generateTMDBToken = async () => {
  try {
    console.log('🔍 Debug API_KEY:', API_KEY ? 'Clé présente' : 'Clé manquante');
    console.log('🔍 API_KEY type:', typeof API_KEY);
    console.log('🔍 API_KEY length:', API_KEY ? API_KEY.length : 0);
    
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('Clé API TMDB non configurée. Veuillez configurer VITE_TMDB_API_KEY dans le fichier .env');
    }

    console.log('🎬 Génération du token TMDB...');
    
    const response = await fetch(AUTH_TOKEN_URL, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la génération du token: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Token TMDB généré avec succès:', data.request_token.substring(0, 10) + '...');
    return data.request_token;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du token TMDB:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log('🔐 Tentative de connexion pour:', email);
    
    if (email !== USER.email || password !== USER.password) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    console.log('✅ Credentials validés');
    
    const tmdbToken = await generateTMDBToken();
    
    const authenticatedUser = {
      id: USER.id,
      email: USER.email,
      name: USER.name,
      tmdbToken: tmdbToken,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('cinewave-current-user', JSON.stringify(authenticatedUser));
    
    console.log('🎉 Connexion réussie !');
    return { success: true, user: authenticatedUser };
    
  } catch (error) {
    console.error('💥 Erreur de connexion:', error.message);
    return { success: false, error: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem('cinewave-current-user');
  console.log('👋 Déconnexion réussie');
  return { success: true };
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('cinewave-current-user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const getTMDBToken = () => {
  const user = getCurrentUser();
  return user ? user.tmdbToken : null;
};


export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getTMDBToken,
  USER
};
