import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Catalogue from "./pages/catalogue";
import FilmDetail from "./pages/film-detail";
import Watchlist from "./pages/watchlist";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import AdminPage from "./pages/admin";
import { useState, useEffect } from "react";
import { WatchlistProvider } from "./utils/WatchlistContext";
import { getCurrentUser } from "./utils/UserInfo";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#00E0FF] mb-4">CINEWAVE</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF] mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <WatchlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/films" element={
            <ProtectedRoute>
              <Catalogue />
            </ProtectedRoute>
          } />
          <Route path="/film/:id" element={
            <ProtectedRoute>
              <FilmDetail />
            </ProtectedRoute>
          } />
          <Route path="/catalogue" element={
            <ProtectedRoute>
              <Catalogue />
            </ProtectedRoute>
          } />
          <Route path="/recherche" element={
            <ProtectedRoute>
              <Catalogue />
            </ProtectedRoute>
          } />
          <Route path="/ma-liste" element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WatchlistProvider>
  );
}

export default App;
