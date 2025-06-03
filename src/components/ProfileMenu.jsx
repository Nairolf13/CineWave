import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const profiles = [
    { id: 1, name: 'Utilisateur', avatar: null },
    { id: 2, name: 'Invité', avatar: null },
  ];
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-white rounded-full bg-zinc-700 w-8 h-8 flex items-center justify-center"
        onClick={toggleMenu}
        aria-label="Menu profil"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-50 animate-fadeDown">
          <div className="p-2 border-b border-zinc-800">
            <p className="text-gray-400 text-xs">Profiles</p>
            {profiles.map(profile => (
              <button
                key={profile.id}
                className="flex items-center w-full p-2 hover:bg-zinc-800 rounded text-left my-1"
              >
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center mr-2">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="text-white text-sm">{profile.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white">{profile.name}</span>
              </button>
            ))}
          </div>
          
          <div className="p-2">
            <Link to="/profil" className="block w-full text-left p-2 hover:bg-zinc-800 rounded text-white">
              Paramètres du compte
            </Link>
            <button
              className="block w-full text-left p-2 hover:bg-zinc-800 rounded text-white"
              onClick={() => {
                if (onLogout) onLogout();
                setIsOpen(false);
              }}
            >
              Se déconnecter
            </button>
          </div>
          
          <div className="p-2 border-t border-zinc-800">
            <p className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} CINEWAVE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileMenu.propTypes = {
  onLogout: PropTypes.func,
};

export default ProfileMenu;
