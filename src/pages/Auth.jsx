// src/pages/Auth.jsx
import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleAuth(e) {
    e.preventDefault();

    if (isSignup) {
      // SIGNUP
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) return alert(error.message);

      alert("Account created! Check your email to confirm.");
      return;
    } else {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return alert(error.message);

      console.log("Logged in:", data.user);
      navigate("/"); // redirect home
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{ color: "white" }}>
        {isSignup ? "Create Account" : "Login"}
      </h2>


      <form onSubmit={handleAuth} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

        <p style={{ marginTop: 10, color: "white" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
            style={styles.switch}
            onClick={() => setIsSignup(!isSignup)}
        >
            {isSignup ? "Log In" : "Sign Up"}
        </span>
        </p>

    </div>
  );
}

const styles = {
  container: {
    width: "350px",
    margin: "80px auto",
    textAlign: "center",
    padding: "20px",
    borderRadius: "12px",
    background: "#121212",
    color: "white",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "white",
    color: "",
    fontWeight: "bold",
    cursor: "pointer",
  },
  switch: {
    color: "cyan",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
