import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Homepage } from "./routes/homepage";
import { Favorites } from "./routes/favorites";
import { GifPage } from "./routes/singleGifs";
import { Search } from "./routes/search";
import { Categories } from "./routes/Categories";
import { AppLayout } from "./layouts/appLayout";
import GifProvider from "./context/gifContext";
import { AuthProvider } from "./context/authContext";

// Homepage
// categories
// search
// favorites
// single gif

const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/:type/:slug",
        element: <GifPage />,
      },
      {
        path: "/:category",
        element: <Categories />,
      },
      {
        path: "/search/:query",
        element: <Search />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <GifProvider>
        <RouterProvider router={router} />
      </GifProvider>
    </AuthProvider>
  );
};

export default App;
