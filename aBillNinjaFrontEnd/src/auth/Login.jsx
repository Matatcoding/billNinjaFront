import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const phone = formData.get("phone");
    const password = formData.get("password");

    console.log("Logging in:", { phone, password });

    try {
      await login({ phone, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Log in to your account</h1>
      <form
        form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onLogin(formData);
        }}
      >
        <label>
          Phone Number
          <input type="text" name="phone" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Login</button>
        {error && <output>{error}</output>}
      </form>
      <Link to="/register">Need an account? Register here.</Link>
    </>
  );
}
