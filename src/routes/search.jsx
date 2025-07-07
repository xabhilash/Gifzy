import { useEffect, useRef, useCallback } from "react";
import { GifContextVal } from "../context/gifContext";
import { useParams } from "react-router-dom";
import FilterGifs from "../components/FilterGifs";
import Gifs from "../components/Gifs";

export const Search = () => {
  const { gifs, filter, loadMoreGifs, resetGifs, isLoading, hasMore } = GifContextVal();
  const { query } = useParams();
  const observer = useRef();

  // Reset and load gifs when query or filter changes
  useEffect(() => {
    resetGifs();
    loadMoreGifs(query);
  }, [query, filter]);

  // Intersection Observer callback
  const lastGifRef = useCallback(node => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGifs(query);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, query]);

  return (
    <div className="my-4">
      <h2 className="text-5xl pb-3 font-extrabold">{query}</h2>
      <FilterGifs alignLeft={true} />
      {gifs.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
          {gifs.map((gif, index) => (
            <div key={gif.id} ref={index === gifs.length - 1 ? lastGifRef : null}>
              <Gifs gif={gif} />
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <span>
          No GIFs found for {query}. Try searching for stickers instead?
        </span>
      ) : null}
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
