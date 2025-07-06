import { useParams } from "react-router-dom";
import { GifContextVal } from "../context/gifContext";
import { useEffect, useState } from "react";
import Gifs from "../components/Gifs";
import Socials from "../components/Socials";

export const Categories = () => {
  const [categoryResults, setCategoryResults] = useState([]);

  const { gf, filter } = GifContextVal();

  const { category } = useParams();

  const fetchCategoryResults = async () => {
    const { data } = await gf.gifs(category, category);
    setCategoryResults(data);
  };

  useEffect(() => {
    fetchCategoryResults();
  }, [category]);

  return (
    <div className="flex flex-col sm:flex-row gap-5 my-4">
      <div className="w-80 sm:72">
        {categoryResults.length > 0 && (
          <Gifs gif={categoryResults[0]} hover={false} />
        )}
        <span className="text-gray-400 pt-4 text-sm">
          Don&apos;t tell it to me, GIF it to me!
        </span>
        <Socials />
        <hr className="bg-gray-100 opacity-50 my-5" />
      </div>
      <div>
        <h2 className="text-4xl pb-1 capitalize font-extrabold">
          {category.split("-").join(" & ")} GIFs
        </h2>
        <h2 className="text-lg pb-3 text-gray-400 hover:text-gray-50 font-bold cursor-pointer">
          @{category}
        </h2>
        {categoryResults.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
            {categoryResults.slice(1).map((gif) => (
              <Gifs key={gif.id} gif={gif} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
