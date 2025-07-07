import { useEffect, useRef, useCallback } from "react";
import { GifContextVal } from "../context/gifContext";
import banner from "../svgs/banner.gif";
import Gifs from "../components/Gifs";
import FilterGifs from "../components/FilterGifs";

export const Homepage = () => {
  const { gifs, filter, loadMoreGifs, resetGifs, isLoading, hasMore } = GifContextVal();
  const observer = useRef();

  // Reset gifs when filter changes
  useEffect(() => {
    resetGifs();
    loadMoreGifs();
  }, [filter]);

  // Intersection Observer callback
  const lastGifRef = useCallback(node => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGifs();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore]);

  return (
    <div>
      <img src={banner} alt="banner logo" className="w-full rounded mt-2" />
      <FilterGifs showTrending />
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
        {gifs.map((gif, index) => (
          <div key={gif.id} ref={index === gifs.length - 1 ? lastGifRef : null}>
            <Gifs gif={gif} />
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      )}
      {!hasMore && gifs.length > 0 && (
        <div className="text-center py-4 text-gray-400">
          No more GIFs to load
        </div>
      )}
    </div>
  );
};
