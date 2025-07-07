import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GifContextVal } from "../context/gifContext";
import Gifs from "../components/Gifs";
import {
  HiMiniChevronDown,
  HiMiniChevronUp,
  HiMiniHeart,
} from "react-icons/hi2";
import Socials from "../components/Socials";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa6";
import { FiLink } from "react-icons/fi";

const contentType = ["gifs", "stickers", "text"];

export const GifPage = () => {
  const { type, slug } = useParams();
  const [gif, setGif] = useState([]);
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const { gf, addToFavorites, favorites } = GifContextVal();

  const shareGif = () => {};
  const copyLinkGif = () => {};

  const fetchGif = async () => {
    const gifId = slug.split("-");
    const { data } = await gf.gif(gifId[gifId.length - 1]);
    const { data: related } = await gf.related(gifId[gifId.length - 1], {
      limit: 10,
    });

    setGif(data);
    setRelatedGifs(related);
  };

  useEffect(() => {
    if (!contentType.includes(type)) {
      throw new Error("Invalid content type");
    }

    fetchGif();
  }, []);

  return (
    <div className="grid grid-cols-4 my-10 gap-4">
      <div className="hidden sm:block">
        {gif?.user ? (
          <>
            <div className="flex flex-wrap gap-1">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="lg:px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="font-bold text-gray-400 text-sm">
                  @{gif?.user?.username}
                </div>
              </div>
            </div>
            {gif?.user?.description && (
              <p className="py-4 whitespace-pre-line">
                {readMore
                  ? gif?.user?.description
                  : gif?.user?.description.slice(0, 100) + " ..."}
                {gif.user.description.length > 100 && (
                  <div
                    onClick={() => {
                      setReadMore(!readMore);
                    }}
                    className="flex items-center font-bold text-gray-400 text-sm cursor-pointer"
                  >
                    {readMore ? (
                      <>
                        Read less <HiMiniChevronUp size={20} />
                      </>
                    ) : (
                      <>
                        Read more <HiMiniChevronDown size={20} />
                      </>
                    )}
                  </div>
                )}
              </p>
            )}
            <Socials />
            <hr className="bg-gray-100 opacity-50 my-5" />
            {gif?.source && (
              <div>
                <span className="font-bold text-gray-400 text-sm">Socials</span>
                <div className="flex items-center text-sm font-bold gap-1">
                  <HiOutlineExternalLink size={25} />
                  <a href={gif?.source} target="_blank" className="truncate">
                    {gif?.source}
                  </a>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          <div className="w-full sm:w-3/4">
            <p className="font-bold text-gray-400 text-sm truncate mb-2">
              {gif.title}
            </p>
            <Gifs gif={gif} hover={false} />
            {/* mobile view */}
            <div className="flex sm:hidden gap-1">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="font-bold text-gray-400 text-sm">
                  @{gif?.user?.username}
                </div>
              </div>
              <button className="ml-auto" onClick>
                <FaPaperPlane size={25} />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-5 mt-4">
            <button
              onClick={() => {
                addToFavorites(gif.id);
              }}
              className="flex items-center gap-5 font-bold text-lg cursor-pointer hover:text-[#d72f48] group"
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gif.id) ? "text-red-500" : ""
                } group-hover:scale-120 transition-transform duration-300`}
              />
              Favorite
            </button>
            <button
              onClick={shareGif}
              className="flex items-center gap-6 font-bold text-lg cursor-pointer hover:text-[#2fd790] group"
            >
              <FaPaperPlane
                size={25}
                className="group-hover:scale-120 transition-transform duration-300"
              />{" "}
              Share
            </button>
            <button
              onClick={copyLinkGif}
              className="flex items-center gap-5 font-bold text-lg cursor-pointer hover:text-blue-500 group"
            >
              {" "}
              <FiLink
                size={30}
                className="group-hover:scale-120 transition-transform duration-300"
              />
              Copy Link
            </button>
          </div>
        </div>
        <div>
          <span className="font-extrabold">Related GIFs</span>
          <div className="columns-2 md:columns-3 gap-2">
            {relatedGifs.map((gif) => (
              <Gifs gif={gif} key={gif.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
