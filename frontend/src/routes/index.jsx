import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import NotFound from "../components/NotFound";
import Items from "../pages/Dashboard/items/Items";
import User from "../pages/Dashboard/users/User";
import PrivateRoute from "../helpers/privateRoute/PrivateRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/items",
        element: (
          <PrivateRoute>
            <Items />
          </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRoute>
            <User />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
