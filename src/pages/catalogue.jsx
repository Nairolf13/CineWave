import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './partials/header';
import Footer from './partials/footer';
import useSearchFilms from '../utils/searchAPI';
import ListFilms from './partials/ListFilms';

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [activeCategory, setActiveCategory] = useState('populaires');
  const { searchResults, isLoading: isSearchLoading } = useSearchFilms(searchQuery || '');

  useEffect(() => {
    if (!searchQuery) {
      setActiveCategory('populaires');
    }
  }, [searchQuery]);
  
  const categories = [
    { id: 'populaires', name: 'Populaires' },
    { id: 'tendances', name: 'Tendances' },
    { id: 'nouveautes', name: 'Nouveautés' },
    { id: 'action', name: 'Action' },
    { id: 'comedie', name: 'Comédie' }
  ];

  const getHeaderContent = () => {
    if (searchQuery) {
      return {
        title: `Résultats pour "${searchQuery}"`,
        description: `${searchResults.length} films trouvés`
      };
    }
    return {
      title: 'Catalogue',
      description: 'Des milliers de films et séries à découvrir'
    };
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="py-24">
        <header className="mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-teal-400">{headerContent.title}</h1>
            <p className="mt-2 text-lg text-gray-300">
              {headerContent.description}
            </p>
            
            {!searchQuery && (
              <div className="mt-6 pb-1 border-b border-zinc-800">
                <div className="flex overflow-x-auto space-x-6 scrollbar-hide">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-1 py-2 text-lg font-medium whitespace-nowrap transition-colors ${
                        activeCategory === category.id 
                          ? 'text-white border-b-2 border-teal-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
        <main>
          {searchQuery ? (
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map(film => (
                  <ListFilms.FilmCard key={film.id} film={film} />
                ))}
                
                {searchResults.length === 0 && !isSearchLoading && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
                    <p className="text-gray-400">Essayez avec d'autres termes de recherche</p>
                  </div>
                )}
                
                {isSearchLoading && (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ListFilms category={activeCategory} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Catalogue;