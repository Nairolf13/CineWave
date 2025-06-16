import React from 'react';
import Header from './partials/header';
import Footer from './partials/footer';
import { getCurrentUser } from '../utils/Auth';

function AdminPage() {
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-teal-400 mb-8">Administration</h1>
          
          <div className="grid gap-8">
            {/* Informations utilisateur actuel */}
            <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Utilisateur connecté</h2>
              {currentUser ? (
                <div className="space-y-2">
                  <p><span className="text-gray-400">Nom :</span> {currentUser.name}</p>
                  <p><span className="text-gray-400">Email :</span> {currentUser.email}</p>
                  <p><span className="text-gray-400">Connecté depuis :</span> {new Date(currentUser.loginTime).toLocaleString()}</p>
                  <p><span className="text-gray-400">Token TMDB :</span> {currentUser.tmdbToken ? '✅ Actif' : '❌ Absent'}</p>
                </div>
              ) : (
                <p className="text-gray-400">Aucun utilisateur connecté</p>
              )}
            </div>

            {/* Informations système */}
            <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Système d'authentification</h2>
              <div className="space-y-2">
                <p><span className="text-gray-400">Type :</span> Utilisateur unique avec token TMDB</p>
                <p><span className="text-gray-400">Email autorisé :</span> fb_du_13@live.fr</p>
                <p><span className="text-gray-400">API TMDB :</span> ✅ Configurée</p>
                <p><span className="text-gray-400">LocalStorage :</span> ✅ Fonctionnel</p>
              </div>
            </div>

            {/* Actions administrateur */}
            <div className="bg-zinc-900 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Actions</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Nettoyer le localStorage
                </button>
                <button 
                  onClick={() => {
                    console.log('État actuel:', {
                      user: getCurrentUser(),
                      localStorage: {
                        currentUser: localStorage.getItem('cinewave-current-user'),
                        watchlist: localStorage.getItem('watchlist')
                      }
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ml-4"
                >
                  Debug console
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
