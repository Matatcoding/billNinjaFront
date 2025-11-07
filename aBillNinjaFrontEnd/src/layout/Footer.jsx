import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Footer() {
  const { token } = useAuth();

  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} BillNinja</p>
      {token && (
        <Link to="/support" className="footer-link">
          <button>Contact Support</button>
        </Link>
      )}
    </footer>
  );
}
