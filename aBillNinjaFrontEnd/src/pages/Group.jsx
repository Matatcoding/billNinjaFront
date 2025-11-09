import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../auth/AuthContext";
// import useQuery from "../api/useQuery";
// import useMutation from "../api/useMutation";
import ItemForm from "../components/ItemForm";

const API = import.meta.env.VITE_API_URL;

export default function Group() {
  const { id } = useParams();
  const { token } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadGroup = async () => {
    try {
      const res = await fetch(`${API}/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load group");
      const data = await res.json();
      setGroup(data.group);
      setMembers(data.members);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadItems = async () => {
    try {
      const res = await fetch(`${API}/items?groupId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePay = async (itemId) => {
    try {
      const res = await fetch(`${API}/items/${itemId}/pay`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update payment");
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([loadGroup(), loadItems()]);
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>Group not found.</p>;

  return (
    <section>
      <h1>{group.name}</h1>
      <h2>Members</h2>
      <ul>
        {members.map((mem) => (
          <li key={mem.id}>
            {mem.first_name} {mem.last_name}
          </li>
        ))}
      </ul>
      <ItemForm groupId={id} members={members} />
      <h2>Items</h2>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        items.map((item) => {
          const owers = item.owers || [];
          const itemMembers = owers.length + 1;
          const splitAmount = (item.cost / itemMembers).toFixed(2);
          const payer = members.find((m) => m.id === item.payerUserId);
          return (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>Cost: ${item.cost}</p>
              <p>
                Payer:{" "}
                {payer ? `${payer.first_name} ${payer.last_name}` : "Unknown"}
              </p>
              <p className="owersTitle">Owers:</p>
              <ul className="owers">
                {owers.length === 0 ? (
                  <li>No owers</li>
                ) : (
                  owers.map((ower) => {
                    const member = members.find((m) => m.id === ower.id);
                    return member ? (
                      <li key={ower.id}>
                        {member.first_name} {member.last_name} owes $
                        {splitAmount}
                        <input
                          type="checkbox"
                          checked={ower.paid}
                          onChange={() => handlePay(item.id)}
                          disabled={ower.paid}
                        />
                      </li>
                    ) : null;
                  })
                )}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
}
