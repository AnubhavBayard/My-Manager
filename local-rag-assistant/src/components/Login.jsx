import { useState } from "react";
import { supabase } from "../lib/supabase";
import "../index.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleAuth() {
    setErrorMsg("");
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // After sign‑up Supabase sends a confirmation email; optionally sign‑in automatically
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        setUser(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
      }
    } catch (err) {
      console.error(err.message);
      setErrorMsg(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="auth-heading">DocMind</h1>
      </div>
      <div className="auth-container">
        <div className="glass-card">
          <h2 className="auth-title">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-btn" onClick={handleAuth}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <p className="auth-toggle-text">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}
            <span
              className="auth-toggle-link"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? " Log in" : " Sign up"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
