import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './button';
import { getImageUrl } from '../utils/config';

const HeroSection = ({ movie, onPlay }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedMovie, setDisplayedMovie] = useState(movie);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!movie) return;
    
    let timeout;
    if (displayedMovie?.id !== movie.id) {
      setIsTransitioning(true);
      
      timeout = setTimeout(() => {
        setDisplayedMovie(movie);
        setIsTransitioning(false);
        setProgress(0); 
      }, 500); 
    }
    
    return () => clearTimeout(timeout);
  }, [movie, displayedMovie]);
  
  useEffect(() => {
    if (!displayedMovie) return;
    
    const startTime = Date.now();
    const totalDuration = 30000; 
    
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);
    }, 100); 
    
    return () => clearInterval(progressInterval);
  }, [displayedMovie]);
  
  if (!displayedMovie) return null;

  const { 
    id, 
    title, 
    backdrop_path, 
    overview, 
    vote_average, 
    release_date,
    runtime 
  } = displayedMovie;

  const year = release_date ? new Date(release_date).getFullYear() : null;

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  const duration = formatRuntime(runtime);

  return (
    <div className="relative h-screen w-full flex items-end pb-32">
      <div className="absolute inset-0 bg-black">
        {backdrop_path && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <img
              src={getImageUrl(backdrop_path, 'backdrop', 'original')}
              alt={title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className={`max-w-2xl transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-5xl font-bold mb-4 tracking-wide">{title.toUpperCase()}</h1>
          
          <div className="flex items-center space-x-3 mb-4">
            {vote_average && (
              <span className="bg-[#00E0FF] text-black px-2 py-0.5 rounded text-sm font-bold">
                {vote_average.toFixed(1)}
              </span>
            )}
            {year && <span className="text-white">{year}</span>}
            {duration && <span className="text-white">{duration}</span>}
            <span className="border border-white px-1 text-xs">4K</span>
          </div>
          
          <p className="text-gray-300 mb-8 line-clamp-3">
            {overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              onClick={() => onPlay && onPlay(movie)}
              startIcon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              }
            >
              Regarder
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open(`/film/${id}`, '_blank')}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Plus d'infos
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div 
          className="h-full bg-primary transition-all ease-linear duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

HeroSection.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    backdrop_path: PropTypes.string,
    overview: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
    runtime: PropTypes.number
  }),
  onPlay: PropTypes.func
};

export default HeroSection;
