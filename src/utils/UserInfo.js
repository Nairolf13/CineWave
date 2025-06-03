import userList from './UserList';
import RegisteredUsers from './RegisteredUsers';
import { API_OPTIONS } from './config';
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const AUTH_TOKEN_URL = 'https://api.themoviedb.org/3/authentication/token/new';

const generateAuthToken = async () => {
  try {
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
    return data.request_token;
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log("Début de l'enregistrement de l'utilisateur:", userData.email);
    const token = await generateAuthToken();
    console.log("Token généré avec succès");
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      token,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    try {
      console.log("Tentative d'ajout avec RegisteredUsers pour:", newUser.email);
      try {
        RegisteredUsers.addUser(newUser);
        console.log("Ajout réussi avec RegisteredUsers");
      } catch (regError) {
        console.error("Erreur avec RegisteredUsers:", regError);
      }
      
      console.log("Tentative de sauvegarde directe dans le localStorage pour:", newUser.email);
      const currentUsers = JSON.parse(localStorage.getItem('cinewave-users')) || [];
      
      if (!currentUsers.some(user => user.email === newUser.email)) {
        currentUsers.push(newUser);
        
        localStorage.setItem('cinewave-users', JSON.stringify(currentUsers));
        console.log("Sauvegarde directe réussie, nombre total d'utilisateurs:", currentUsers.length);
      } else {
        console.warn("Email déjà utilisé dans la sauvegarde directe:", newUser.email);
      }
      
      userList.push(newUser);
      
      localStorage.setItem('cinewave-current-user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (addError) {
      console.error("Erreur complète lors de l'ajout:", addError);
      throw new Error(addError.message);
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    return { success: false, error: error.message };
  }
};

export const loginUser = (email, password) => {
  try {
    let user;
    try {
      user = RegisteredUsers.validateCredentials(email, password);
    } catch (validationError) {
      throw new Error(validationError.message);
    }
    
    user.lastLogin = new Date().toISOString();
    RegisteredUsers.updateUser(user.id, { lastLogin: user.lastLogin });
    
    const userIndex = userList.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      userList[userIndex] = user;
    }
    
    localStorage.setItem('cinewave-current-user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('cinewave-current-user');
  return { success: true };
};

export const getCurrentUser = () => {
  const currentUser = localStorage.getItem('cinewave-current-user');
  return currentUser ? JSON.parse(currentUser) : null;
};

export const updateUserInfo = (userId, updatedInfo) => {
  try {
    const userIndex = userList.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    
    const updatedUser = {
      ...userList[userIndex],
      ...updatedInfo,
      updatedAt: new Date().toISOString()
    };
    
    userList[userIndex] = updatedUser;
    
    localStorage.setItem('cinewave-users', JSON.stringify(userList));
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('cinewave-current-user', JSON.stringify(updatedUser));
    }
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    return { success: false, error: error.message };
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserInfo
};