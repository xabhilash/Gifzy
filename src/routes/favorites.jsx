import { useEffect, useState } from "react";
import { GifContextVal } from "../context/gifContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Gifs from "../components/Gifs";
import { FcGoogle } from "react-icons/fc";

export const Favorites = () => {
  const [favoriteGifs, setFavoriteGifs] = useState([]);
  const { gf, favorites } = GifContextVal();
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const fetchFavoriteGifs = async () => {
    if (favorites.length > 0) {
      const { data } = await gf.gifs(favorites);
      setFavoriteGifs(data);
    } else {
      setFavoriteGifs([]);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchFavoriteGifs();
    }
  }, [user, favorites]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-bold text-center">
          Sign in to view your favorite GIFs
        </h2>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <span className="font-bold text-gray-400 text-sm">My Favorites</span>
      {favoriteGifs.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 mt-2">
          {favoriteGifs.map((gif) => (
            <Gifs gif={gif} key={gif.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl font-semibold">No favorite GIFs yet!</p>
          <p className="text-gray-400 mt-2">
            Click the heart icon on any GIF to add it to your favorites.
          </p>
        </div>
      )}
    </div>
  );
};
