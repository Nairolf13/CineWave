const registeredUsers = JSON.parse(localStorage.getItem('cinewave-users')) || [];

export const addUser = (user) => {
  console.log("RegisteredUsers: Tentative d'ajout d'un utilisateur", user.email);
  
  const currentUsers = JSON.parse(localStorage.getItem('cinewave-users')) || [];
  
  if (currentUsers.some(existingUser => existingUser.email === user.email)) {
    console.error("RegisteredUsers: Email déjà utilisé:", user.email);
    throw new Error('Un utilisateur avec cet email existe déjà');
  }
  
  const newUser = {
    ...user,
    id: user.id || Date.now().toString(),
    createdAt: user.createdAt || new Date().toISOString(),
    lastLogin: user.lastLogin || new Date().toISOString()
  };
  
  registeredUsers.push(newUser);
  
  currentUsers.push(newUser);
  
  localStorage.setItem('cinewave-users', JSON.stringify(currentUsers));
  console.log("RegisteredUsers: Utilisateur ajouté avec succès, nombre total:", currentUsers.length);
  
  return newUser;
};

export const getAllUsers = () => {
  return [...registeredUsers]; 
};

export const getUserById = (userId) => {
  return registeredUsers.find(user => user.id === userId);
};

export const getUserByEmail = (email) => {
  return registeredUsers.find(user => user.email === email);
};

export const updateUser = (userId, updatedData) => {
  const index = registeredUsers.findIndex(user => user.id === userId);
  
  if (index === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  registeredUsers[index] = {
    ...registeredUsers[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('cinewave-users', JSON.stringify(registeredUsers));
  
  return registeredUsers[index];
};

export const deleteUser = (userId) => {
  const index = registeredUsers.findIndex(user => user.id === userId);
  
  if (index === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  registeredUsers.splice(index, 1);
  
  localStorage.setItem('cinewave-users', JSON.stringify(registeredUsers));
  
  return { success: true };
};

export const validateCredentials = (email, password) => {
  const user = getUserByEmail(email);
  
  if (!user) {
    throw new Error('Aucun utilisateur trouvé avec cet email');
  }
  
  if (user.password !== password) {
    throw new Error('Mot de passe incorrect');
  }
  
  return user;
};

// Récupérer la liste à jour des utilisateurs avant l'export
const getAllUsersFromStorage = () => {
  try {
    const fromStorage = localStorage.getItem('cinewave-users');
    return fromStorage ? JSON.parse(fromStorage) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs du localStorage:", error);
    return [];
  }
};

export default {
  registeredUsers,
  addUser,
  getAllUsers: getAllUsersFromStorage, // Utiliser la nouvelle fonction qui lit directement depuis localStorage
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  validateCredentials
};
