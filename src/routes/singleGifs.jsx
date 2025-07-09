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
import { FaTwitter, FaFacebook, FaWhatsapp, FaTelegram } from "react-icons/fa";

const contentType = ["gifs", "stickers", "text"];

export const GifPage = () => {
  const { type, slug } = useParams();
  const [gif, setGif] = useState([]);
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { gf, addToFavorites, favorites } = GifContextVal();

  const shareGif = (gif) => {
    setShowShareModal(true);
  };

  const copyLinkGif = async () => {
    try {
      const gifUrl = gif?.images?.original?.url || gif?.url || window.location.href;
      await navigator.clipboard.writeText(gifUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocial = (platform) => {
    const gifUrl = gif?.images?.original?.url || gif?.url || window.location.href;
    const title = gif?.title || "Check out this GIF!";
    const encodedUrl = encodeURIComponent(gifUrl);
    const encodedTitle = encodeURIComponent(title);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

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
             {showToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Copied to clipboard!
        </div>
      )}

              {showShareModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Share GIF</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <FaTwitter size={20} />
                Twitter
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <FaFacebook size={20} />
                Facebook
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </button>
              <button
                onClick={() => shareToSocial('telegram')}
                className="flex items-center justify-center gap-2 p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <FaTelegram size={20} />
                Telegram
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              <button className="ml-auto cursor-pointer" onClick={() => shareGif(gif)}>
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
              onClick={() => {shareGif(gif)}}
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
