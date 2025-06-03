import React, { createContext, useState, useContext, useEffect } from 'react';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('cinewave-watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('cinewave-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);
  
  const addToWatchlist = (film) => {
    if (!watchlist.some(item => item.id === film.id)) {
      setWatchlist([...watchlist, film]);
      return true;
    }
    return false;
  };
  
  const removeFromWatchlist = (filmId) => {
    setWatchlist(watchlist.filter(film => film.id !== filmId));
  };
  
  const isInWatchlist = (filmId) => {
    return watchlist.some(film => film.id === filmId);
  };
  
  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };
  
  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist doit être utilisé à l\'intérieur d\'un WatchlistProvider');
  }
  return context;
};
