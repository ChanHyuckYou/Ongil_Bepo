import {useEffect} from "react";
import {Navigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
    }
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/" replace/>;
  }
  return children;
};

export default ProtectedRoute;
