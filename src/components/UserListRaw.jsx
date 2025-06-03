import React from 'react';
import userList from '../utils/UserList';

const UserListRaw = () => {
  const userListJSON = JSON.stringify(userList, null, 2);
  
  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">Contenu brut de userList</h2>
      
      {userList.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Le tableau userList est vide.</p>
      ) : (
        <div>
          <p className="text-white mb-2">Nombre d'utilisateurs : {userList.length}</p>
          <pre className="bg-zinc-800 p-4 rounded-lg overflow-auto max-h-96 text-gray-300 text-sm">
            {userListJSON}
          </pre>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-xl font-bold text-teal-400 mb-2">LocalStorage</h3>
        <button
          onClick={() => {
            const localStorageContent = localStorage.getItem('cinewave-users');
            console.log('LocalStorage (cinewave-users):', localStorageContent);
            alert('Contenu du localStorage affiché dans la console.');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-3"
        >
          Afficher localStorage dans la console
        </button>
        
        <button
          onClick={() => {
            const testUser = {
              id: Date.now().toString(),
              firstname: "Test",
              lastname: "Utilisateur",
              email: `test${Date.now()}@exemple.com`,
              password: "motdepasse123",
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            userList.push(testUser);
            localStorage.setItem('cinewave-users', JSON.stringify(userList));
            alert('Utilisateur test ajouté. Actualisez la page pour voir les changements.');
            window.location.reload();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Ajouter un utilisateur test
        </button>
      </div>
    </div>
  );
};

export default UserListRaw;
