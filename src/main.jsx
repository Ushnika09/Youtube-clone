import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DataProvider from "./context/DataContext";
import Home from "./layout/Home";
import Search from "./layout/Search";
import Playvideo from "./layout/Playvideo";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/search/:query",
        element:<Search/>
      },
      {
        path:"/video/:id",
        element:<Playvideo/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>
);
