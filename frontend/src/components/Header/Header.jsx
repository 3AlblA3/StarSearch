import { useSelector, useDispatch } from "react-redux";
import { logout, loginSuccess } from "../../store/authSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // ✅ Get auth state from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/validate-token", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(loginSuccess({ user: data.user, token: "stored-in-cookies" })); // ✅ Set Redux auth state
        } else {
          dispatch(logout()); // ✅ Only logout if token is invalid
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      dispatch(logout()); // ✅ Update Redux auth state
      navigate("/"); // ✅ Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/home" className={styles.logo}>
        Star Search
      </Link>
      {isAuthenticated && (
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      )}
    </header>
  );
}
