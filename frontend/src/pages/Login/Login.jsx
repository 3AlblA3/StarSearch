import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleLogin = async () => {
    // Requête POST vers notre login
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      // Si la réponse est ok
      if (response.ok) {
        dispatch(loginSuccess({ user: username, token: data.token })); // Passage par Redux
        navigate("/home"); // redirige vers l'accueil en cas de connexion réussie
      // Sinon
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div className={styles.container}>
      <input className={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className={styles.button} onClick={handleLogin}>Login</button>
      </div>
      <p>{message}</p>
    </div>
  );
}
