import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './partials/header';
import Footer from './partials/footer';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import CategoryList from '../components/CategoryList';
import Button from '../components/button';
import Modal from '../components/MediaPlayer';
import { useFeaturedMovie } from '../utils/useFeaturedMovie.js';
import useGetFilms from '../utils/FilmsAPI.js';
import { getFilmVideos } from '../utils/FilmsAPI.js';
import { getCurrentUser } from '../utils/UserInfo.js';

const globalStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const { featuredMovie, isLoading: isLoadingFeatured } = useFeaturedMovie();
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  
  useEffect(() => {
    const user = getCurrentUser();
    console.log("État de connexion :", user ? "Connecté" : "Non connecté", user);
    
    // Vérification supplémentaire pour s'assurer que l'utilisateur est valide
    if (user && (!user.id || !user.email)) {
      console.log("Utilisateur invalide détecté, nettoyage...");
      localStorage.removeItem('cinewave-current-user');
      setCurrentUser(null);
    } else {
      setCurrentUser(user);
    }
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      console.log("Changement détecté :", updatedUser ? "Connecté" : "Non connecté");
      setCurrentUser(updatedUser);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const { films: trendingFilms, isLoading: isLoadingTrending } = useGetFilms('tendances');
  const { films: popularFilms, isLoading: isLoadingPopular } = useGetFilms('populaires');
  const { films: newReleaseFilms, isLoading: isLoadingNewReleases } = useGetFilms('nouveautes');
  const { films: actionFilms, isLoading: isLoadingAction } = useGetFilms('action');
  const { films: comedyFilms, isLoading: isLoadingComedy } = useGetFilms('comedie');
  
  const categories = [
    { id: 'tous', name: 'Tous' },
    { id: 'action', name: 'Action' },
    { id: 'aventure', name: 'Aventure' },
    { id: 'comedie', name: 'Comédie' },
    { id: 'drame', name: 'Drame' },
    { id: 'fantastique', name: 'Fantastique' },
    { id: 'horreur', name: 'Horreur' },
    { id: 'sci-fi', name: 'Sci-Fi' },
  ];

  const handlePlayMovie = async (movie) => {
    setSelectedFilm(movie);
    setIsLoadingTrailer(true);
    setIsModalOpen(true);
    
    try {
      const videos = await getFilmVideos(movie.id);
      
      const trailer = videos.find(video => video.type === 'Trailer') || 
                     videos.find(video => video.type === 'Teaser') || 
                     videos[0];
      
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du trailer:', error);
      setTrailerKey(null);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
    setTrailerKey(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{globalStyles}</style>
      
      <Header transparent={true} />
      
      {!isLoadingFeatured && featuredMovie && (
        <HeroSection 
          movie={featuredMovie} 
          onPlay={handlePlayMovie}
        />
      )}
      
      {isModalOpen && selectedFilm && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {isLoadingTrailer ? (
              <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF]"></div>
              </div>
            ) : (
              <Modal 
                type="video"
                embedId={trailerKey}
                title={selectedFilm.title}
                description={selectedFilm.overview}
                src={!trailerKey ? "/assets/media/sample-video.mp4" : null}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Contenu disponible uniquement pour les utilisateurs connectés */}
      {currentUser && currentUser.id ? (
        <div className="container mx-auto px-4">
          <div className="mt-8">
            <CategoryList 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          <section>
            <MovieRow 
              title="Tendances actuelles" 
              movies={trendingFilms} 
              isLoading={isLoadingTrending}
              viewAllLink="/tendances"
              cardSize="medium"
              onPlayMovie={handlePlayMovie}
            />
            
            <MovieRow 
              title="Populaires sur CINEWAVE" 
              movies={popularFilms} 
              isLoading={isLoadingPopular}
              viewAllLink="/populaires"
              cardSize="medium"
              onPlayMovie={handlePlayMovie}
            />
            
            <MovieRow 
              title="Nouveautés" 
              movies={newReleaseFilms} 
              isLoading={isLoadingNewReleases}
              viewAllLink="/nouveautes"
              cardSize="medium"
              onPlayMovie={handlePlayMovie}
            />
            
            <MovieRow 
              title="Films d'action" 
              movies={actionFilms} 
              isLoading={isLoadingAction}
              viewAllLink="/genres/action"
              cardSize="medium"
              onPlayMovie={handlePlayMovie}
            />
            
            <MovieRow 
              title="Comédies" 
              movies={comedyFilms} 
              isLoading={isLoadingComedy}
              viewAllLink="/genres/comedie"
              cardSize="medium"
              onPlayMovie={handlePlayMovie}
            />
          </section>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#00E0FF]">Connectez-vous pour accéder à tout le catalogue</h2>
          <p className="text-xl text-gray-400 mb-8">
            Découvrez des milliers de films et séries en vous connectant à votre compte CINEWAVE
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              text="Se connecter" 
              onClick={() => navigate('/login')}
              variant="primary"
              size="large"
            />
            <Button 
              text="S'inscrire" 
              onClick={() => navigate('/register')}
              variant="outline"
              size="large"
            />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;
