import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import Plan from "./pages/Plan";
import Do from "./pages/Do";
import Focus from "./pages/Focus";
import Setting from "./pages/setting";
import Login from "./pages/login";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/Plan" /> },
  { path: "/Plan", element: <Plan /> },
  { path: "/Do", element: <Do /> },
  { path: "/Focus", element: <Focus /> },
  { path: "/Setting", element: <Setting /> },
  { path: "/Login", element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
