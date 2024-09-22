import { store } from "../../app/store";
import { urlsApiSlice } from "../urls/urlApiSlice";
import { clientsApiSlice } from "../clients/clientsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      urlsApiSlice.util.prefetch("getUrls", "urlsList", { force: true })
    );
    store.dispatch(
      clientsApiSlice.util.prefetch("getClients", "clientsList", {
        force: true,
      })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);
  return <Outlet />;
};
export default Prefetch;
