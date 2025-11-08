import { useState } from "react";
import { useParams } from "react-router";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function Group() {
  const { id } = useParams();
  const {
    data: groupData,
    loading: groupLoading,
    error: groupError,
  } = useQuery(`/groups/${id}`, `group-${id}`);
  const {
    data: itemsData,
    loading: itemsLoading,
    error: itemsError,
  } = useQuery(`/items?groupId=${id}`, `items-${id}`);
  const { mutate: payItem } = useMutation("PUT", "", [`items-${id}`]);

  const handlePay = (itemId) => {
    payItem(null, `/items/${itemId}/pay`);
  };

  if (groupLoading || itemsLoading) return <p>Loading...</p>;
  if (groupError || itemsError) return <p>Error loading group.</p>;

  const { group, members } = groupData;

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

      <h2>Items</h2>
      {itemsData.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        itemsData.map((item) => {
          const owers = item.owers || [];
          const itemMembers = owers.length + 1;
          const splitAmount = (item.cost / itemMembers.length).toFixed(2);
          return (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>Cost: ${item.cost}</p>
              <p>Payer: {item.payer_name}</p>
              <ul>
                {owers.map((ower) => (
                  <li key={ower.id}>
                    {ower.first_name} {ower.last_name} owes ${splitAmount}
                    <input
                      type="checkbox"
                      checked={ower.paid}
                      onChange={() => handlePay(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
}
