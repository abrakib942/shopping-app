/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "../../components/Loading";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    if (!token) {
      navigate("/login", { state: { from: location } });
    }
  }, [token, location, navigate, isInitialLoad, dispatch]);

  if (isInitialLoad) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
