import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilmDetails, getFilmVideos } from '../utils/FilmsAPI';
import Button from '../components/button';
import MediaPlayer from '../components/MediaPlayer';
import { getImageUrl } from '../utils/config';
import { useWatchlist } from '../utils/WatchlistContext';

const FilmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchFilmData = async () => {
      setIsLoading(true);
      try {
        const filmData = await getFilmDetails(id);
        setFilm(filmData);
        
        const videosData = await getFilmVideos(id);
        setVideos(videosData);
        
        const defaultVideo = videosData.find(v => v.type === 'Trailer') || 
                           videosData.find(v => v.type === 'Teaser') || 
                           videosData[0];
        
        if (defaultVideo) {
          setSelectedVideo(defaultVideo);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données du film:', err);
        setError(err.message || 'Erreur lors du chargement du film');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFilmData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Durée inconnue';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="mb-4">{error || "Ce film n'a pas pu être chargé."}</p>
          <Button 
            variant="danger"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div 
        className="relative h-[50vh] bg-cover bg-center" 
        style={{ 
          backgroundImage: film.backdrop_path ? 
            `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${getImageUrl(film.backdrop_path, 'backdrop', 'original')})` : 
            'linear-gradient(to bottom, #111, #000)'
        }}
      >
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{film.title}</h1>
            {film.tagline && (
              <p className="text-xl text-gray-300 mb-4 italic">"{film.tagline}"</p>
            )}
            
            <div className="flex space-x-4 mb-4">
              <Button 
                variant="primary" 
                size="large"
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                }
                onClick={() => setSelectedVideo(videos.find(v => v.type === 'Trailer') || videos[0] || null)}
              >
                Regarder
              </Button>
              
              {isInWatchlist(film.id) ? (
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => removeFromWatchlist(film.id)}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Retirer de ma liste
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => addToWatchlist(film)}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Ajouter à ma liste
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-[#00E0FF]/90 rounded-full text-black font-medium text-sm">
                {formatDate(film.release_date)}
              </span>
              {film.runtime && (
                <span className="px-3 py-1 bg-zinc-700/90 rounded-full text-sm">
                  {formatRuntime(film.runtime)}
                </span>
              )}
              {film.vote_average && (
                <span className="px-3 py-1 bg-zinc-700/90 rounded-full text-sm flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {film.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-lg mb-6">
              {film.poster_path ? (
                <img 
                  src={getImageUrl(film.poster_path, 'poster', 'large')} 
                  alt={film.title} 
                  className="w-full h-auto"
                />
              ) : (
                <div className="bg-zinc-800 w-full h-[450px] flex items-center justify-center">
                  <span className="text-zinc-500">Image non disponible</span>
                </div>
              )}
            </div>
            
            <div className="bg-zinc-900 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-3">Informations</h3>
              <div className="space-y-2">
                {film.genres && (
                  <div>
                    <span className="text-gray-400">Genres: </span>
                    <span>{film.genres.map(g => g.name).join(', ')}</span>
                  </div>
                )}
                {film.production_companies && film.production_companies.length > 0 && (
                  <div>
                    <span className="text-gray-400">Production: </span>
                    <span>{film.production_companies.map(c => c.name).join(', ')}</span>
                  </div>
                )}
                {film.original_language && (
                  <div>
                    <span className="text-gray-400">Langue originale: </span>
                    <span>{film.original_language.toUpperCase()}</span>
                  </div>
                )}
                {film.budget > 0 && (
                  <div>
                    <span className="text-gray-400">Budget: </span>
                    <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(film.budget)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="mb-8">
              {selectedVideo ? (
                <MediaPlayer 
                  embedId={selectedVideo.key}
                  title={`${film.title} - ${selectedVideo.name}`}
                  type="video"
                />
              ) : (
                <div className="bg-zinc-900 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Aucune vidéo disponible pour ce film.</p>
                  <Button 
                    variant="danger" 
                    className="mt-4"
                    onClick={() => setSelectedVideo({key: 'sample-video', type: 'full-movie', name: 'Film complet'})}
                  >
                    Voir le film complet
                  </Button>
                </div>
              )}
              
              {videos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    variant={selectedVideo?.type === 'full-movie' ? 'danger' : 'danger-outline'}
                    size="small"
                    onClick={() => setSelectedVideo({key: 'sample-video', type: 'full-movie', name: 'Film complet'})}
                  >
                    Film complet
                  </Button>
                  
                  {videos.slice(0, 5).map((video) => (
                    <Button 
                      key={video.id}
                      variant={selectedVideo?.id === video.id ? 'danger' : 'danger-outline'}
                      size="small"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {video.type === 'Trailer' ? 'Bande annonce' : 
                       video.type === 'Teaser' ? 'Teaser' : video.type}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {film.overview || "Aucun synopsis disponible pour ce film."}
              </p>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="mt-4"
            >
              Retour au catalogue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmDetail;
