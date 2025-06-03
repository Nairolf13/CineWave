import React, { useState, useEffect } from 'react';
import RegisteredUsers from '../utils/RegisteredUsers';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = () => {
      try {
        const usersFromStorage = localStorage.getItem('cinewave-users');        
        const parsedUsers = usersFromStorage ? JSON.parse(usersFromStorage) : [];
    
        setUsers(parsedUsers);
        
        if (parsedUsers.length === 0) {
          console.warn('Aucun utilisateur trouvé dans le localStorage. Essayez de créer un utilisateur test.');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
    
    window.addEventListener('storage', loadUsers);
    
    return () => window.removeEventListener('storage', loadUsers);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">Utilisateurs enregistrés</h2>
      
      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Aucun utilisateur enregistré pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
            <thead className="bg-zinc-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Date d'inscription</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Dernière connexion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-700">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-white">{user.firstname} {user.lastname}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
