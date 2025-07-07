import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../svgs/logo.svg";
import { HiEllipsisVertical, HiMiniBars3BottomRight } from "react-icons/hi2";
import { GifContextVal } from "../context/gifContext";
import GifSearch from "./Gif-search";
import AuthButtons from "./AuthButtons";
import { useAuth } from "../context/authContext";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const { gf, favorites, favoritesLoaded } = GifContextVal();
  const { user } = useAuth();

  const fetchGifCategories = async () => {
    const { data } = await gf.categories();

    setCategories(data);
  };

  useEffect(() => {
    fetchGifCategories();
  }, []);

  return (
    <nav>
      <div className="relative flex gap-4 mb-4 justify-between items-center">
        <Link to="/" className="flex gap-2">
          <img src={logo} alt="giphy Logo" />
          <h1 className="text-4xl font-bold cursor-pointer tracking-tight text-white">
            GIPHY
          </h1>
        </Link>
        <div className="flex font-bold text-md gap-4 items-center">
          {categories?.slice(0, 5).map((category) => (
            <Link
              key={category.name}
              to={`/${category.name_encoded}`}
              className="hover:bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 hidden lg:block"
            >
              <p className="px-4 py-1 text-white border-b-4">{category.name}</p>
            </Link>
          ))}

          <button
            onClick={() => {
              setShowCategories(!showCategories);
            }}
          >
            <HiEllipsisVertical
              size={35}
              className={`hover:bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 ${
                showCategories
                  ? "bg-gradient-to-r from-green-600 via-blue-600 to-pink-600"
                  : ""
              } hidden py-0.5 border-b-4 cursor-pointer lg:block`}
            />
          </button>
          {user && favoritesLoaded && favorites.length > 0 && (
            <div className="h-9 hidden sm:block bg-gray-700 py-1.5 px-6 rounded cursor-pointer">
              <Link to="/favorites">
                <p className="text-white">Favorite GIFs ({favorites.length})</p>
              </Link>
            </div>
          )}
          <AuthButtons />
          <button>
            <HiMiniBars3BottomRight
              size={30}
              className="text-sky-400 block lg:hidden"
            />
          </button>
        </div>
        {showCategories ? (
          <div className="absolute right-0 top-14 px-10 pt-6 pb-9 bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 w-full z-1">
            <span className="text-2xl tracking-wide font-extrabold">
              Categories
            </span>
            <hr className="bg-gray-100 opacity-50 my-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/${category.name_encoded}`}
                  className="font-bold"
                >
                  <p className="text-white inline-block">{category.name}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <GifSearch />
    </nav>
  );
};

export default Header;
