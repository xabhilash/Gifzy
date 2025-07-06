import { useEffect } from "react";
import { GifContextVal } from "../context/gifContext";
import banner from "../svgs/banner.gif";
import Gifs from "../components/Gifs";
import FilterGifs from "../components/FilterGifs";

export const Homepage = () => {
  const { gf, gifs, setGifs, filter } = GifContextVal();

  const fetchTrendingGifs = async () => {
    const { data } = await gf.trending({
      limit: 20,
      type: filter,
      rating: "g",
    });
    setGifs(data);
  };

  useEffect(() => {
    fetchTrendingGifs();
  }, [filter]);

  return (
    <div>
      <img src={banner} alt="banner logo" className="w-full rounded mt-2" />
      <FilterGifs showTrending />
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
        {gifs.map((gif) => (
          <Gifs key={gif.id} gif={gif} />
        ))}
      </div>
    </div>
  );
};
