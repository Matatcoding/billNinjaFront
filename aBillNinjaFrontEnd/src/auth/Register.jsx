import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (formData) => {
    const phone = formData.get("phone");
    const password = formData.get("password");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");

    console.log("Registering:", { phone, password, first_name, last_name });

    try {
      await register({ phone, password, first_name, last_name });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Register for an account</h1>
      <form
        form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onRegister(formData);
        }}
      >
        <label>
          Phone Number
          <input type="phone" name="phone" />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <label>
          First Name
          <input type="text" name="first_name" required />
        </label>
        <label>
          Last Name
          <input type="text" name="last_name" required />
        </label>
        <button>Register</button>
        {error && <output>{error}</output>}
      </form>
      <Link to="/login">Already have an account? Log in here.</Link>
    </>
  );
}
