import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DataProvider from "./context/DataContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>
);
