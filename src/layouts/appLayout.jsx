import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export const AppLayout = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="container mx-auto px-6 py-4">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
