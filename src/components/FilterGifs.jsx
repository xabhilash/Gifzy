/* eslint-disable react/prop-types */
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { GifContextVal } from "../context/gifContext";

const Filters = [
  {
    title: "GIFS",
    value: "gifs",
    background:
      "inline-block rounded border-2 border-info px-3 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-info-50/50 hover:text-info-600 focus:border-info-600 focus:bg-info-50/50 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 motion-reduce:transition-none dark:hover:bg-cyan-950 dark:focus:bg-cyan-950 border-teal-500",
  },
  {
    title: "Stickers",
    value: "stickers",
    background:
      "inline-block rounded border-2 border-info px-3 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-info-50/50 hover:text-info-600 focus:border-info-600 focus:bg-info-50/50 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 motion-reduce:transition-none dark:hover:bg-cyan-950 dark:focus:bg-cyan-950 border-teal-500",
  },
  {
    title: "Text",
    value: "text",
    background:
      "inline-block rounded border-2 border-info px-3 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-info-50/50 hover:text-info-600 focus:border-info-600 focus:bg-info-50/50 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 motion-reduce:transition-none dark:hover:bg-cyan-950 dark:focus:bg-cyan-950 border-teal-500",
  },
];

const FilterGifs = ({ alignLeft = false, showTrending = false }) => {
  const { filter, setFilter } = GifContextVal();
  return (
    <div
      className={`flex gap-5 items-center my-3 ${
        alignLeft ? "" : "justify-end"
      } ${showTrending ? "justify-between flex-wrap" : ""}`}
    >
      {showTrending ? (
        <div className="flex gap-2">
          <span>
            <HiMiniArrowTrendingUp size={25} className="text-teal-500" />
          </span>
          <span className="font-semibold text-gray-400">Trending</span>
        </div>
      ) : null}
      <div className="flex gap-3 grow sm:grow-0 min-w-[200px] bg-gray-800 rounded-full justify-between">
        {Filters.map((f) => (
          <button
            onClick={() => {
              setFilter(f.value);
            }}
            key={f.title}
            className={`${
              filter === f.value ? f.background : ""
            } font-semibold py-2 w-1/2 text-center cursor-pointer rounded-full`}
          >
            {f.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterGifs;
