import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Homepage() {
  const { token } = useAuth();
  return (
    <div className="homepage">
      <section className="Welcome">
        <h1>Welcome to BillNinja</h1>
        <p>
          BillNinja makes it effortless to split expenses with friends, family,
          and roommates. If you want to plan a trip, keep an ongoing tab with
          your friends, or simply split a singular bill, BillNinja has you back.
        </p>
        <Link to={token ? "/account" : "/register"}>
          <button className="direct-button">Get Started</button>{" "}
        </Link>
      </section>
      <section className="whyus">
        <h2>What BillNinja Does</h2>
        <ul>
          <li>
            <h3>Create Groups Easily</h3>
            <p>Set up groups for trips, events, or bills in seconds.</p>
          </li>
          <li>
            <h3>Track Expenses</h3>
            <p>
              Add an itemized list of expenses, assign who paid what, and see
              who owes what.
            </p>
          </li>
          <li>
            <h3>Stay Organized</h3>
            <p>
              Everything on BillNinja is transparent and easy for all users to
              see.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
