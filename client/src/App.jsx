import { Route, Routes } from "react-router-dom";
import { ROLES } from "./config/roles";
import Layout from "./components/Layout";
import Welcome from "./components/Welcome";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Home from "./components/Home";
import Prefetch from "./features/auth/Prefetch";
import RequireAuth from "./features/auth/RequireAuth";
import ClientList from "./features/clients/ClientList";
import EditClient from "./features/clients/EditClient";
import NewClient from "./features/clients/NewClient";
import PersistLogin from "./features/auth/PersisLogin";
import EditUser from "./features/users/EditUser";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Unprotected Routes */}
        <Route index element={<Welcome />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="home" element={<DashLayout />}>
                <Route index element={<Home />} />
                <Route path="clients">
                  <Route index element={<ClientList />} />
                  <Route path="new" element={<NewClient />} />
                  <Route path=":clientId" element={<EditClient />} />
                </Route>
                <Route path="users/:userId" element={<EditUser />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
