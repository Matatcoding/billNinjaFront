import { useState } from "react";

export default function GroupForm({ onCreate }) {
  const [name, setName] = useState("");
  const [phones, setPhones] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneList = phones
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (!name.trim() || phoneList.length === 0) return;

    onCreate(name.trim(), phoneList);
    setName("");
    setPhones("");
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <label>
        Group name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Member phones (comma-separated):
        <input
          type="text"
          value={phones}
          onChange={(e) => setPhones(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Group</button>
    </form>
  );
}
