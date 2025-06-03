import { useEffect, useState } from 'react';
import useGetFilms, { getFilmVideos } from '../../utils/FilmsAPI';
import { getImageUrl } from '../../utils/config';
import Button from '../../components/button';
import MediaPlayer from '../../components/MediaPlayer';
import MovieCard from '../../components/MovieCard';
import { useWatchlist } from '../../utils/WatchlistContext';

const ListFilms = ({ category = 'populaires' }) => {
  console.log("ListFilms component rendered with category:", category);
  const { films, isLoading, error } = useGetFilms(category);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  useEffect(() => {
    console.log("Category changed to:", category);
    setSelectedFilm(null);
    setTrailerKey(null);
  }, [category]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-bold mb-2">Erreur</h2>
        <p>{error.message || 'Une erreur s\'est produite lors du chargement des films'}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF]"></div>
      </div>
    );
  }

  if (!films || films.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-2">Aucun film trouvé</h2>
        <p className="text-gray-600">Essayez de rafraîchir la page ou revenez plus tard.</p>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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
        console.log(`Lecture du trailer: ${trailer.name} (${trailer.key})`);
      } else {
        setTrailerKey(null);
        console.log(`Aucun trailer trouvé pour: ${film.title}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du trailer:`, error);
      setTrailerKey(null);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-[#00E0FF]">
        {category === 'populaires' && 'Films populaires'}
        {category === 'tendances' && 'Films tendances'}
        {category === 'nouveautes' && 'Nouveaux films'}
        {category === 'action' && 'Films d\'action'}
        {category === 'comedie' && 'Comédies'}
      </h2>
      
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF]"></div>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {films.map(film => (
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
                  <p className="text-xs text-gray-300 mb-2">{formatDate(film.release_date)}</p>
                  
                  <div className="flex space-x-2 mb-2">
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
                    
                    {isInWatchlist(film.id) ? (
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => removeFromWatchlist(film.id)}
                        startIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 000-2H7z" clipRule="evenodd" />
                          </svg>
                        }
                      >
                        Retirer
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => addToWatchlist(film)}
                        startIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        }
                      >
                        Ajouter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 text-white flex-grow sm:hidden">
              <h3 className="text-lg font-bold truncate">{film.title}</h3>
              <p className="text-xs text-gray-400 mb-2">
                {formatDate(film.release_date)}
              </p>
              <div className="flex space-x-2 mb-2">
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
                
                {isInWatchlist(film.id) ? (
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => removeFromWatchlist(film.id)}
                    startIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 000-2H7z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Retirer
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => addToWatchlist(film)}
                    startIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Ajouter
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilmCard = ({ film }) => {
  return <MovieCard movie={film} showTitle size="medium" showRating={true} />;
};

ListFilms.FilmCard = FilmCard;

export default ListFilms;
