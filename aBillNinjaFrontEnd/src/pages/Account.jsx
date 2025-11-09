import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import GroupForm from "../components/GroupForm.jsx";

const API = import.meta.env.VITE_API_URL;

export default function Account() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadGroups = async () => {
    try {
      const res = await fetch(`${API}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load groups");
      }
      const data = await res.json();
      setGroups(data);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Failed to load groups");
      setStatus("error");
    }
  };

  const loadFriends = async () => {
    try {
      setStatus("loading");
      setError("");
      const res = await fetch(`${API}/users/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load friends");
      }
      const data = await res.json();
      setFriends(data);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Failed to load friends");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadFriends();
    loadGroups();
  }, []);

  const handleCreateGroup = async (name, phoneList) => {
    try {
      const res = await fetch(`${API}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, groupUsers: phoneList }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add group");
      }
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to add group");
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!newFriendPhone.trim()) return;
    setError("");
    try {
      const res = await fetch(`${API}/users/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newFriendPhone.trim() }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add friend");
      }
      setNewFriendPhone("");
      await loadFriends();
    } catch (err) {
      setError(err.message || "Failed to add friend");
    }
  };
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "This will permanently delete your account and related data. Continue?"
    );
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${API}/users/deleteAccount`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete account");
      }
      logout();
      navigate("/register");
    } catch (err) {
      setError(err.message || "Failed to delete account");
    }
  };
  return (
    <div className="accountStyle">
      <h1>Account</h1>
      <section>
        <h2>Friends</h2>
        {status === "loading" && <p>Loading friends...</p>}
        {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
        {status === "idle" && friends.length === 0 && <p>No friends yet.</p>}
        {status === "idle" && friends.length > 0 && (
          <ul>
            {friends.map((f) => (
              <li key={f.phone}>
                {f.first_name
                  ? `${f.first_name} ${f.last_name} (${f.phone})`
                  : f.phone}
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={handleAddFriend}
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxWidth: "300px",
          }}
        >
          <label>
            Add friend by phone
            <input
              type="text"
              value={newFriendPhone}
              onChange={(e) => setNewFriendPhone(e.target.value)}
              placeholder="Friend's phone number"
              required
            />
          </label>
          <button type="submit">Add Friend</button>
        </form>
        <div className="groups">
          <h2 className="groupsTitle">Your Groups</h2>
          {groups.length === 0 ? (
            <p>No groups yet.</p>
          ) : (
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <Link to={`/groups/${g.id}`}>{g.name}</Link>
                </li>
              ))}
            </ul>
          )}
          <GroupForm onCreate={handleCreateGroup} />
        </div>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h2>Danger Zone</h2>
        <button
          type="button"
          onClick={handleDeleteAccount}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Delete My Account
        </button>
      </section>
      {error && status !== "error" && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}
    </div>
  );
}
