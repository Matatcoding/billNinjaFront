// import { useState } from "react";
// import useMutation from "../api/useMutation";

// export default function ItemForm({ groupId, members }) {
//   const { mutate: createItem } = useMutation("POST", "/items", [
//     `items-${groupId}`,
//   ]);

//   const [name, setName] = useState("");
//   const [cost, setCost] = useState("");
//   const [payerUserId, setPayerUserId] = useState("");
//   const [owers, setOwers] = useState([]);
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const payload = {
//       name,
//       cost: parseFloat(cost),
//       groupId: Number(groupId),
//       payerUserId: Number(payerUserId),
//       owers: owers.map(Number),
//     };
//     createItem(
//       { name, cost, groupId, payerUserId, owers },
//       () => {
//         setMessage("Item created!");
//         setName("");
//         setCost("");
//         setPayerUserId("");
//         setOwers([]);
//       },
//       (err) => setMessage(err.message)
//     );
//   };

//   return (
//     <div>
//       <h2>Create New Item</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Item Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Cost:</label>
//           <input
//             type="number"
//             value={cost}
//             onChange={(e) => setCost(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Payer:</label>
//           <select
//             value={payerUserId}
//             onChange={(e) => setPayerUserId(e.target.value)}
//             required
//           >
//             <option value="">Select payer</option>
//             {members.map((mem) => (
//               <option key={mem.id} value={mem.id}>
//                 {mem.first_name} {mem.last_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Owers:</label>
//           {members.map((mem) => (
//             <div key={mem.id}>
//               <label>
//                 <input
//                   type="checkbox"
//                   value={mem.id}
//                   checked={owers.includes(mem.id)}
//                   onChange={(e) => {
//                     const id = Number(e.target.value);
//                     setOwers((prev) =>
//                       e.target.checked
//                         ? [...prev, id]
//                         : prev.filter((owerId) => owerId !== id)
//                     );
//                   }}
//                 />
//                 {mem.first_name} {mem.last_name}
//               </label>
//             </div>
//           ))}
//         </div>

//         <button type="submit">Create Item</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }
