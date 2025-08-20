import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
// import Explore from "./pages/Explore"; // example
// import Trending from "./pages/Trending"; // example

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // { path: "explore", element: <Explore /> },
      // { path: "trending", element: <Trending /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
