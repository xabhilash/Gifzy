/* eslint-disable react/prop-types */

import { HiMiniHeart } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { GifContextVal } from "../context/gifContext";

const Gifs = ({ gif, hover = true }) => {
  const { favorites, addToFavorites } = GifContextVal();
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites(gif.id);
  };

  return (
    <Link to={`/${gif.type}s/${gif.slug}`}>
      <div className="relative w-full mb-2 cursor-pointer group aspect-video">
        <img
          src={gif?.images?.fixed_width.webp}
          alt={gif?.title}
          className="w-full rounded object-cover transition-all duration-300"
        />
        {hover ? (
          <div className="absolute text-white inset-0 opacity-0 group-hover:opacity-100 flex items-end gap-2 p-2 bg-gradient-to-b from-transparent via-transparent to-black font-bold">
            <button
              onClick={handleFavoriteClick}
              className="cursor-pointer absolute top-[12px] right-[12px]"
            >
              <HiMiniHeart
                size={25}
                className={`${
                  favorites.includes(gif.id) ? "text-red-500" : ""
                }`}
              />
            </button>
            <img
              src={gif?.user?.avatar_url}
              alt={gif?.user?.display_name}
              className="h-8 rounded-4xl"
            />
            <span>{gif?.user?.display_name}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default Gifs;
