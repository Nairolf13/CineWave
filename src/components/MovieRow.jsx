import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';

const MovieRow = ({ 
  title, 
  movies = [], 
  isLoading = false, 
  viewAllLink = "", 
  cardSize = "medium",
  onPlayMovie
}) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className={`
                ${cardSize === 'small' ? 'w-32' : 
                  cardSize === 'large' ? 'w-52 sm:w-56' : 'w-40 sm:w-44'} 
                aspect-[2/3] bg-zinc-800 animate-pulse rounded
              `}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink}
            className="text-[#00E0FF] hover:underline text-sm flex items-center"
          >
            Voir tout
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie}
            size={cardSize}
            showRating={true}
            showTitle={true}
            linkToDetail={!onPlayMovie}
            onClick={onPlayMovie ? () => onPlayMovie(movie) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

MovieRow.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.array,
  isLoading: PropTypes.bool,
  viewAllLink: PropTypes.string,
  cardSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onPlayMovie: PropTypes.func
};

export default MovieRow;
