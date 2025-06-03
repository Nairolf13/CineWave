import { useState, useEffect } from 'react';
import { API_OPTIONS, BASE_URL } from './config';


const useSearchFilms = (query = '') => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchFilms = async () => {
      setIsLoading(true);

      try {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=fr-FR&page=1`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzZkNTYzYzVhNmE5NDRkNjlhNWEwMTYzNTI4MDQ0YiIsIm5iZiI6MTc0NzIyMzc3Ny44NjQsInN1YiI6IjY4MjQ4NGUxNThkZTI2NzUwNDdlODgzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hOO-w3r_Bc-L2xI5_eq3ZUC6NaeOuNEBJ9thr7MEpv0`
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur de recherche: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data.results || []);
        setError(null);
        
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError(err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchFilms();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { searchResults, isLoading, error };
};

export default useSearchFilms;

export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const url = `https://api.themoviedb.org/3/search/keyword?query=${encodeURIComponent(query)}&page=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzZkNTYzYzVhNmE5NDRkNjlhNWEwMTYzNTI4MDQ0YiIsIm5iZiI6MTc0NzIyMzc3Ny44NjQsInN1YiI6IjY4MjQ4NGUxNThkZTI2NzUwNDdlODgzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hOO-w3r_Bc-L2xI5_eq3ZUC6NaeOuNEBJ9thr7MEpv0`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur de suggestions: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    return [];
  }
};
