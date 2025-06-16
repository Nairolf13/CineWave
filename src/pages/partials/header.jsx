import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useSearchFilms from '../../utils/searchAPI';
import { getCurrentUser, logout } from '../../utils/Auth';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { searchResults } = useSearchFilms(isSearchFocused ? searchQuery : '');
  
  // Vérifier si l'utilisateur est connecté au chargement et lors des changements
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    // Déclencher un événement de stockage pour mettre à jour les autres composants
    window.dispatchEvent(new Event('storage'));
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black border-b border-[#00E0FF]/10">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#00E0FF] tracking-wider">CINEWAVE</Link>
        </div>
        
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <Link to="/" className="text-white hover:text-[#00E0FF] transition-colors">Accueil</Link>
          
          {currentUser && (
            <>
              <Link to="/films" className="text-white hover:text-[#00E0FF] transition-colors">Films</Link>
              <Link to="/series" className="text-white hover:text-[#00E0FF] transition-colors">Séries</Link>
              <Link to="/ma-liste" className="text-white hover:text-[#00E0FF] transition-colors">Ma Liste</Link>
            </>
          )}
          
          {currentUser && (
            <Link 
              to="/admin" 
              className="text-white hover:text-[#00E0FF] transition-colors"
            >
              Administration
            </Link>
          )}
        </nav>
          
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSearchFocused(true)} 
            className="text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {currentUser ? (
            <>
              <div className="text-white hover:text-[#00E0FF] transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{currentUser.firstname}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 transition-colors flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white focus:outline-none hover:text-[#00E0FF] transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}
        </div>
      </div>
      
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#00E0FF]">Recherche</h2>
              <button 
                onClick={() => setIsSearchFocused(false)}
                className="text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <input
                type="search"
                placeholder="Titre, acteur, genre..."
                name="search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-black/80 border-b-2 border-[#00E0FF] text-white py-2 px-3 focus:outline-none"
                autoFocus
              />
            </form>
            
            {searchQuery && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.slice(0, 8).map(movie => (
                  <Link 
                    key={movie.id} 
                    to={`/film/${movie.id}`} 
                    className="flex items-center bg-zinc-900 rounded overflow-hidden hover:bg-zinc-800 transition-colors"
                    onClick={() => setIsSearchFocused(false)}
                  >
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={movie.title} 
                        className="w-16 h-24 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-zinc-800 flex items-center justify-center">
                        <span className="text-xs text-zinc-500">No img</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-white font-medium truncate">{movie.title}</p>
                      <p className="text-xs text-gray-400">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Date inconnue'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              searchQuery && (
                <p className="text-center text-gray-400 py-8">Aucun résultat trouvé</p>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
