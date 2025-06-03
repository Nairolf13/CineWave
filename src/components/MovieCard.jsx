import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getImageUrl } from '../utils/config';

const MovieCard = ({ 
  movie, 
  size = 'medium', 
  showRating = true,
  showTitle = true,
  linkToDetail = true,
  className = '',
  onClick 
}) => {
  if (!movie) return null;

  const { id, title, poster_path, vote_average, release_date, genre_ids } = movie;
  const year = release_date ? new Date(release_date).getFullYear() : null;
  
  const sizes = {
    small: 'w-32',
    medium: 'w-40 sm:w-44',
    large: 'w-52 sm:w-56',
  };

  const rating = vote_average ? vote_average.toFixed(1) : null;
  
  const getGenreName = (genreId) => {
    const genres = {
      28: 'Action',
      12: 'Aventure',
      16: 'Animation',
      35: 'Comédie',
      80: 'Crime',
      18: 'Drame',
      10751: 'Famille',
      14: 'Fantastique',
      36: 'Histoire',
      27: 'Horreur',
      10402: 'Musique',
      9648: 'Mystère',
      10749: 'Romance',
      878: 'Sci-Fi',
      53: 'Thriller',
      10752: 'Guerre',
      37: 'Western'
    };
    return genreId && genres[genreId] ? genres[genreId] : 'Drame';
  };
  
  const firstGenre = genre_ids && genre_ids.length > 0 ? getGenreName(genre_ids[0]) : null;

  const cardContent = (
    <div className={`group relative transition-transform duration-300 hover:scale-105 hover:z-10 ${className} ${sizes[size] || sizes.medium}`}>
      <div className="relative aspect-[2/3] rounded overflow-hidden">
        {poster_path ? (
          <img 
            src={getImageUrl(poster_path, 'poster', size === 'large' ? 'medium' : 'small')}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 text-xs text-center px-2">{title}</span>
          </div>
        )}
        
        {showRating && rating && (
          <div className="absolute top-2 left-2 bg-[#00E0FF] text-black px-1.5 py-0.5 rounded text-xs font-bold">
            {rating}
          </div>
        )}
      </div>
      
      {showTitle && (
        <div className="mt-2 text-sm">
          <h3 className="text-white font-medium truncate">{title}</h3>
          <div className="flex items-center text-xs text-gray-400">
            {year && <span>{year}</span>}
            {year && firstGenre && <span className="mx-1">•</span>}
            {firstGenre && <span>{firstGenre}</span>}
          </div>
        </div>
      )}
    </div>
  );

  if (linkToDetail) {
    return (
      <Link to={`/film/${id}`}>
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        className="text-left focus:outline-none"
        onClick={() => onClick(movie)}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
    genre_ids: PropTypes.array
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showRating: PropTypes.bool,
  showTitle: PropTypes.bool,
  linkToDetail: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default MovieCard;
