export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};

export const getImageUrl = (path, type = 'poster', size = 'medium') => {
  if (!path) return null;
  
  const sizeMap = IMAGE_SIZES[type] || IMAGE_SIZES.poster;
  const sizeValue = sizeMap[size] || sizeMap.medium;
  
  return `${IMAGE_BASE_URL}/${sizeValue}${path}`;
};
