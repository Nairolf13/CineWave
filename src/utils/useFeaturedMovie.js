import { useState, useEffect } from 'react';
import { BASE_URL, API_OPTIONS } from './config';

export function useFeaturedMovie() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentIndex,setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(`${BASE_URL}/movie/popular?language=fr-FR`, API_OPTIONS);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        const movies = data.results.filter(movie => movie.backdrop_path); 
        
        setPopularMovies(movies);
        if (movies.length > 0) {
          setFeaturedMovie(movies[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des films populaires:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  useEffect(() => {
    if (popularMovies.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % popularMovies.length;
        setFeaturedMovie(popularMovies[newIndex]);
        return newIndex;
      });
    }, 30000); 
    return () => clearInterval(intervalId);
  }, [popularMovies]);
  

  return { featuredMovie, isLoading, error, popularMovies };
}
