import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Details from "./pages/Details/Details";
import { loginSuccess, logout, setLoading } from "./store/authSlice";


export default function App() {
  // centralisation des loadings via redux et le store
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));

      try {
        // Vérification de notre token s'il est valide ou non
        const response = await fetch("http://localhost:3000/validate-token", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(loginSuccess({ user: data.user, token: "stored-in-cookies" }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
      dispatch(setLoading(false));

    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div className="loading-screen">Travelling at light speed...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
      <Route path="/details/:category/:id" element={isAuthenticated ? <Details /> : <Navigate to="/" />} />
    </Routes>
  );
}
