import { NavLink, Link } from "react-router";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>BillNinja</p>
      </NavLink>
      <nav>
        {token ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <NavLink to="/Login">Log in</NavLink>
        )}
      </nav>
      {token ? (
        <Link to="/Account">Account</Link>
      ) : (
        <Link to="/Register">Account</Link>
      )}
    </header>
  );
}
