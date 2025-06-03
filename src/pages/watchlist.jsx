import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './partials/header';
import Footer from './partials/footer';
import Button from '../components/button';
import { getImageUrl } from '../utils/config';
import { useWatchlist } from '../utils/WatchlistContext';
import { getFilmVideos } from '../utils/FilmsAPI';
import MediaPlayer from '../components/MediaPlayer';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [selectedFilm, setSelectedFilm] = React.useState(null);
  const [trailerKey, setTrailerKey] = React.useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = React.useState(false);

  const handleWatchFilm = async (film) => {
    setSelectedFilm(film);
    setIsLoadingTrailer(true);
    
    try {
      const videos = await getFilmVideos(film.id);
      
      const trailer = videos.find(video => video.type === 'Trailer') || 
                    videos.find(video => video.type === 'Teaser') || 
                    videos[0];
      
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(null);
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du trailer:`, error);
      setTrailerKey(null);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-[#00E0FF]">Ma Liste</h1>
          
          {watchlist.length === 0 && (
            <div className="bg-zinc-900 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Votre liste de films à voir est vide</h2>
              <p className="text-zinc-400 mb-6">Ajoutez des films à votre liste pour les retrouver facilement plus tard</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/films')}
              >
                Découvrir des films
              </Button>
            </div>
          )}

          {selectedFilm && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedFilm.title}</h3>
                <Button 
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setSelectedFilm(null);
                    setTrailerKey(null);
                  }}
                >
                  Fermer
                </Button>
              </div>
              
              {isLoadingTrailer ? (
                <div className="flex justify-center items-center h-56 bg-zinc-900 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF] mx-auto"></div>
                </div>
              ) : trailerKey ? (
                <MediaPlayer 
                  type="video"
                  embedId={trailerKey}
                  title={selectedFilm.title}
                  description={selectedFilm.overview}
                />
              ) : (
                <>
                  <MediaPlayer 
                    src="/assets/media/sample-video.mp4" 
                    type="video"
                    title={selectedFilm.title}
                    description={selectedFilm.overview}
                  />
                  
                  <div className="mt-4 text-sm text-gray-400">
                    <p className="italic">
                      Note: Aucun trailer n'est disponible pour ce film. Une vidéo d'exemple est affichée à la place.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {watchlist.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {watchlist.map(film => (
                <div key={film.id} className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {film.poster_path ? (
                      <img 
                        src={getImageUrl(film.poster_path, 'poster', 'large')}
                        alt={film.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleWatchFilm(film)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/media/placeholder.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-500">{film.title}</span>
                      </div>
                    )}
                    
                    {film.vote_average && (
                      <div className="absolute top-2 right-2 bg-[#00E0FF] text-black px-2 py-1 rounded-md text-sm font-bold">
                        {film.vote_average.toFixed(1)}/10
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="w-full">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{film.title}</h3>
                        <p className="text-xs text-gray-300 mb-3">{formatDate(film.release_date)}</p>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => handleWatchFilm(film)}
                            startIcon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            }
                          >
                            Regarder
                          </Button>
                          
                          <Button 
                            variant="danger" 
                            size="small"
                            onClick={() => removeFromWatchlist(film.id)}
                            startIcon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            }
                          >
                            Retirer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 text-white flex-grow sm:hidden">
                    <h3 className="text-lg font-bold truncate">{film.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDate(film.release_date)}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => handleWatchFilm(film)}
                        startIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        }
                      >
                        Regarder
                      </Button>
                      
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => removeFromWatchlist(film.id)}
                        startIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        }
                      >
                        Retirer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Watchlist;
