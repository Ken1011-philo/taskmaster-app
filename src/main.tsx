import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";

import Plan from "./pages/Plan";
import Do from "./pages/Do";
import Focus from "./pages/Focus";
import Setting from "./pages/setting";
import Login from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      { path: "/Plan", element: <Plan /> },
      { path: "/Do", element: <Do /> },
      { path: "/Setting", element: <Setting /> },
    ],
  },
  {
    path: "/Focus",
    element: <Focus />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);