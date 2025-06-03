import { useState, useEffect, useCallback } from 'react';
import { API_OPTIONS, BASE_URL} from './config';

const categoryEndpoints = {
  populaires: { 
    endpoint: 'discover/movie',
    params: { 
      include_adult: false, 
      include_video: false, 
      sort_by: 'popularity.desc'
    }
  },
  tendances: { 
    endpoint: 'trending/movie/week',
    params: {}
  },
  nouveautes: { 
    endpoint: 'movie/now_playing',
    params: {}
  },
  action: { 
    endpoint: 'discover/movie',
    params: { with_genres: 28 }
  },
  comedie: { 
    endpoint: 'discover/movie',
    params: { with_genres: 35 }
  },
  drame: { 
    endpoint: 'discover/movie',
    params: { with_genres: 18 }
  },
  horreur: { 
    endpoint: 'discover/movie',
    params: { with_genres: 27 }
  },
  scienceFiction: { 
    endpoint: 'discover/movie',
    params: { with_genres: 878 }
  }
};

const useGetFilms = (category = 'populaires') => { 
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [films, setFilms] = useState([]);

    const fetchFilms = useCallback(async (categoryName) => {
      setIsLoading(true);
      
      try {
        const categoryConfig = categoryEndpoints[categoryName] || categoryEndpoints.populaires;
        const { endpoint, params } = categoryConfig;
        
        const queryParams = new URLSearchParams({
          language: 'fr-FR',
          page: 1,
          ...params
        }).toString();
        
        const url = `${BASE_URL}/${endpoint}?${queryParams}`;
        
        const response = await fetch(url, API_OPTIONS);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Résultats API (${categoryName}):`, data);
        
        setFilms(data.results || []);
        setError(null);
      } catch (err) {
        console.error(`Erreur lors de la récupération des films (${categoryName}):`, err);
        setError(err);
        setFilms([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchFilms(category);
    }, [category, fetchFilms]);

    const refreshFilms = () => {
      fetchFilms(category);
    };

    return { films, isLoading, error, refreshFilms };
};

export default useGetFilms;

export const getFilmDetails = async (filmId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${filmId}?language=fr-FR`, API_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du film ${filmId}:`, error);
    throw error;
  }
};

export const getFilmVideos = async (filmId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${filmId}/videos?language=fr-FR&append_to_response=videos&include_video_language=en,fr`, API_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    const videos = data.results || [];
    const sortedVideos = [...videos].sort((a, b) => {
      if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
      if (a.type !== 'Trailer' && b.type === 'Trailer') return 1;
      
      if (a.type === 'Teaser' && b.type !== 'Teaser') return -1;
      if (a.type !== 'Teaser' && b.type === 'Teaser') return 1;
      
      return 0;
    });
    
    return sortedVideos;
  } catch (error) {
    console.error(`Erreur lors de la récupération des vidéos du film ${filmId}:`, error);
    return [];
  }
};