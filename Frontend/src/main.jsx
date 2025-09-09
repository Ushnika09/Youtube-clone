import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DataProvider from "./context/DataContext";
import Home from "./layout/Home";
import Search from "./layout/Search";
import Playvideo from "./layout/Playvideo";
import Login from "./layout/Login";
import Register from "./layout/Register";
import CreateChannel from "./layout/CreateChannel";
import MyChannel from "./layout/MyChannel";
import RootLayout from "./layout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/search/:query",
            element: <Search />,
          },
          {
            path: "/video/:id",
            element: <Playvideo />,
          },
          {
            path: "/my-channel/:id",
            element: <MyChannel />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>
);
