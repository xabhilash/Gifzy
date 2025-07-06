import { useState } from "react";
import { HiMiniXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const GifSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchGif = async () => {
    // check if query is empty
    if (query.trim === "") {
      return;
    }
    navigate(`/search/${query}`);
  };
  return (
    <div className="flex relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all GIFs and stickers"
        className="w-full pl-4 pr-14 py-5 text-xl bg-white text-black rounded-tl rounded-bl border border-gray-300 outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute bg-gray-300 opacity-90 rounded-full right-20 top-6 cursor-pointer"
        >
          <HiMiniXMark size={22} />
        </button>
      )}
      <button
        onClick={searchGif}
        className="bg-gradient-to-tr from-pink-600 to-pink-400 px-4 py-2 rounded-tr rounded-br cursor-pointer"
      >
        <HiOutlineMagnifyingGlass size={35} className="-scale-x-100" />
      </button>
    </div>
  );
};

export default GifSearch;
