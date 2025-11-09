import { useParams } from "react-router";
import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function Group() {
  const { id: groupId } = useParams();

  const { data: groupData, loading: groupLoading } = useQuery(
    `/groups/${groupId}`,
    `group-${groupId}`
  );
  const { data: itemsData, loading: itemsLoading } = useQuery(
    `/items?groupId=${groupId}`,
    `items-${groupId}`
  );

  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    payerUserId: "",
    owers: [],
  });

  const createItem = useMutation("POST", "/items", [`items-${groupId}`]);

  if (groupLoading || itemsLoading) return <p>Loading...</p>;
  if (!groupData || !itemsData) return <p>Group not found.</p>;

  const { group, members } = groupData;
  const items = itemsData;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        owers: checked
          ? [...prev.owers, value]
          : prev.owers.filter((id) => id !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createItem.mutate(
      {
        name: formData.name,
        cost: parseFloat(formData.cost),
        groupId,
        payerUserId: parseInt(formData.payerUserId),
        owers: formData.owers.map((id) => parseInt(id)),
      },
      () => {
        setFormData({ name: "", cost: "", payerUserId: "", owers: [] });
      }
    );
  };

  return (
    <div>
      <h1>{group.name}</h1>
      <h2>Members</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.first_name} {m.last_name}
          </li>
        ))}
      </ul>

      <h2>Add Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={formData.cost}
          onChange={handleFormChange}
          required
        />
        <select
          name="payerUserId"
          value={formData.payerUserId}
          onChange={handleFormChange}
          required
        >
          <option value="">Select payer</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.first_name} {m.last_name}
            </option>
          ))}
        </select>
        <fieldset>
          <legend>Select owers</legend>
          {members.map((m) => (
            <label key={m.id}>
              <input
                type="checkbox"
                value={m.id}
                checked={formData.owers.includes(String(m.id))}
                onChange={handleFormChange}
              />
              {m.first_name} {m.last_name}
            </label>
          ))}
        </fieldset>
        <button type="submit">Add Item</button>
      </form>

      <h2>Items</h2>
      <ul>
        {items.map((item) => {
          const payer = members.find((m) => m.id === item.payer_user_id);
          const owers = item.owers || [];
          const itemMembers = owers.length + 1;
          const splitCost = (item.cost / itemMembers).toFixed(2);
          return (
            <li key={item.id}>
              <strong>{item.name}</strong> - ${item.cost} <br />
              Paid by: {payer?.first_name} {payer?.last_name} <br />
              Owed by:
              <ul>
                {owers.map((ower) => {
                  const member = members.find((m) => m.id === ower.id);
                  return (
                    <li key={ower.id}>
                      {member?.first_name} {member?.last_name} owes ${splitCost}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
