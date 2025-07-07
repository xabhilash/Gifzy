import { GiphyFetch } from "@giphy/js-fetch-api";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./authContext";

const GifContext = createContext();

const GifProvider = ({ children }) => {
  const [gifs, setGifs] = useState([]);
  const [filter, setFilter] = useState("gifs");
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { user } = useAuth();

  // Local storage key for favorites backup
  const getFavoritesKey = (userId) => `favorites_${userId}`;

  // Load favorites from localStorage
  const loadFavoritesFromLocalStorage = (userId) => {
    try {
      const stored = localStorage.getItem(getFavoritesKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  };

  // Save favorites to localStorage
  const saveFavoritesToLocalStorage = (userId, favorites) => {
    try {
      localStorage.setItem(getFavoritesKey(userId), JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  };

  // Sync localStorage with Firebase
  const syncFavoritesWithFirebase = async (userId, localFavorites) => {
    if (!isFirebaseAvailable) return;
    
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { favorites: localFavorites });
      } else {
        // Merge local and remote favorites
        const remoteFavorites = docSnap.data().favorites || [];
        const mergedFavorites = [...new Set([...localFavorites, ...remoteFavorites])];
        
        if (mergedFavorites.length !== remoteFavorites.length) {
          await updateDoc(userDocRef, { favorites: mergedFavorites });
        }
        
        // Update local state with merged favorites
        setFavorites(mergedFavorites);
        saveFavoritesToLocalStorage(userId, mergedFavorites);
      }
      
      setIsFirebaseAvailable(true);
    } catch (error) {
      console.error("Error syncing with Firebase:", error);
      setIsFirebaseAvailable(false);
    }
  };

  const addToFavorites = async (id) => {
    if (!user) {
      // If not logged in, prompt to sign in
      alert("Please sign in to save favorites!");
      return;
    }

    // Store the previous state for error recovery
    const previousFavorites = [...favorites];

    let newFavorites;
    if (favorites.includes(id)) {
      // Remove from favorites
      newFavorites = favorites.filter((favId) => favId !== id);
    } else {
      // Add to favorites
      newFavorites = [...favorites, id];
    }

    // Update state immediately for better UX
    setFavorites(newFavorites);
    
    // Always save to localStorage first
    saveFavoritesToLocalStorage(user.uid, newFavorites);

    // Try to update Firestore
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { favorites: newFavorites });
      } else {
        await updateDoc(userDocRef, { favorites: newFavorites });
      }
      
      setIsFirebaseAvailable(true);
    } catch (error) {
      console.error("Error updating favorites in Firebase:", error);
      setIsFirebaseAvailable(false);
      
      // Don't revert state since we have localStorage backup
      // Just show a warning to user
      console.warn("Favorites saved locally. Will sync when connection is restored.");
    }
  };

  // Load favorites from Firestore when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // Load from localStorage first and show immediately
        const localFavorites = loadFavoritesFromLocalStorage(user.uid);
        setFavorites(localFavorites);
        setFavoritesLoaded(true); // Set to true immediately after localStorage load
        
        // Try to sync with Firebase in the background
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const remoteFavorites = docSnap.data().favorites || [];
            // Merge local and remote favorites
            const mergedFavorites = [...new Set([...localFavorites, ...remoteFavorites])];
            
            // Only update state if there are new favorites
            if (mergedFavorites.length !== localFavorites.length) {
              setFavorites(mergedFavorites);
              saveFavoritesToLocalStorage(user.uid, mergedFavorites);
            }
            
            // Update Firebase with merged favorites if there are new ones
            if (mergedFavorites.length > remoteFavorites.length) {
              await updateDoc(userDocRef, { favorites: mergedFavorites });
            }
          } else {
            // Create new document with local favorites
            if (localFavorites.length > 0) {
              await setDoc(userDocRef, { favorites: localFavorites });
            }
          }
          
          setIsFirebaseAvailable(true);
        } catch (error) {
          console.error("Error syncing favorites with Firebase:", error);
          setIsFirebaseAvailable(false);
          console.warn("Using local favorites. Will sync when connection is restored.");
        }
      } else {
        // Clear favorites when logged out
        setFavorites([]);
        setFavoritesLoaded(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Reset pagination when filter changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
  }, [filter]);

  // Function to load more GIFs
  const loadMoreGifs = async (searchQuery = null) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      let response;
      const limit = 20;

      if (searchQuery) {
        // Search query
        response = await gf.search(searchQuery, {
          sort: "relevant",
          lang: "en",
          type: filter,
          limit,
          offset,
        });
      } else {
        // Trending
        response = await gf.trending({
          limit,
          offset,
          type: filter,
          rating: "g",
        });
      }

      const { data, pagination } = response;
      
      // Update state
      setGifs(prev => offset === 0 ? data : [...prev, ...data]);
      setOffset(prev => prev + limit);
      setHasMore(pagination.total_count > offset + limit);
    } catch (error) {
      console.error("Error loading GIFs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset GIFs
  const resetGifs = () => {
    setGifs([]);
    setOffset(0);
    setHasMore(true);
  };

  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

  return (
    <GifContext.Provider
      value={{
        gf,
        gifs,
        setGifs,
        filter,
        setFilter,
        favorites,
        favoritesLoaded,
        addToFavorites,
        isFirebaseAvailable,
        loadMoreGifs,
        resetGifs,
        isLoading,
        hasMore,
      }}
    >
      {children}
    </GifContext.Provider>
  );
};

export const GifContextVal = () => {
  return useContext(GifContext);
};

export default GifProvider;
