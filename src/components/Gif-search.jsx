import { useState, useRef } from "react";
import { HiMiniXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { GifContextVal } from "../context/gifContext";

const GifSearch = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { gf } = GifContextVal();

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim() === "") return;
    navigate(`/search/${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div className="flex relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search all GIFs and stickers"
        className="w-full pl-4 pr-14 py-5 text-xl bg-white text-black rounded-tl rounded-bl border border-gray-300 outline-none"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
          }}
          className="absolute bg-gray-300 opacity-90 rounded-full right-20 top-6 cursor-pointer hover:bg-gray-400 transition-colors"
        >
          <HiMiniXMark size={22} />
        </button>
      )}
      <button
        onClick={() => handleSearch(query)}
        className="bg-gradient-to-tr from-pink-600 to-pink-400 px-4 py-2 rounded-tr rounded-br cursor-pointer hover:from-pink-700 hover:to-pink-500 transition-colors"
      >
        <HiOutlineMagnifyingGlass size={35} className="-scale-x-100" />
      </button>
    </div>
  );
};

export default GifSearch;
