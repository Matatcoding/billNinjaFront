import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Homepage from "./pages/Homepage";
import Group from "./pages/Group";
import Support from "./pages/Support";
import Account from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/groups/:id" element={<Group />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />}></Route>
        <Route path="/support" element={<Support />}></Route>
      </Route>
    </Routes>
  );
}
