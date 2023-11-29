import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <App />,
      },
    ],
  },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/signup",
  //     element: <Signup />,
  //   },
  //   {
  //     path: "*",
  //     element: <NotFound />,
  //   },
]);

export default routes;
