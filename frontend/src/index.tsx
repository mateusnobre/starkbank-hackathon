import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import Statement from './pages/Statement';
import Transactions from './pages/Transactions';
import Installments from './pages/Installments';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Marketplace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/statement",
    element: <Statement />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/installments",
    element: <Installments />,
    errorElement: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
