import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./global.css";
import ViewCustomer from "@components/ViewCustomer.tsx";
import ViewCustomerList from "@components/ViewCustomerList.tsx";
import ViewLogin from "@components/ViewLogin.tsx";
import Protected from "@components/Protected.tsx";
import ViewAdmin from "@components/ViewAdmin.tsx";
import ViewAdminUsers from "@components/ViewAdminUsers.tsx";
import qs from "qs";
import ViewAccount from "@components/ViewAccount.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: ({ request }) => {
      if (
        request.url === "http://localhost:5173/" ||
        request.url === "http://localhost:3030/" ||
        request.url === "https://poc.lam.bdkcloud.com/"
      ) {
        return redirect(`/customers?${qs.stringify({ $sort: { id: -1 } })}`);
      }

      return null;
    },
    children: [
      {
        path: "customers",
        element: (
          <Protected>
            <Outlet />
          </Protected>
        ),
        children: [
          {
            index: true,
            element: <ViewCustomerList />,
          },
          {
            path: ":id",
            element: <ViewCustomer />,
          },
        ],
      },

      {
        path: "admin",
        element: (
          <Protected>
            <ViewAdmin />
          </Protected>
        ),
        children: [{ path: "users", element: <ViewAdminUsers /> }],
      },
      {
        path: "account",
        element: (
          <Protected>
            <ViewAccount />
          </Protected>
        ),
      },
      {
        path: "login",
        element: <ViewLogin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
