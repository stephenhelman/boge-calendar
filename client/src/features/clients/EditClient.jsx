import { useGetClientsQuery } from "./clientsApiSlice";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import EditClientForm from "./EditClientForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";

const EditClient = () => {
  const { clientId } = useParams();
  const { client } = useGetClientsQuery("clientsList", {
    selectFromResult: ({ data }) => ({
      client: data?.entities[clientId],
    }),
  });
  useTitle(`Edit ${client.fullName}`);

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!client || !users.length) return <PulseLoader color={"#000"} />;

  const content = <EditClientForm client={client} users={users} />;

  return content;
};

export default EditClient;
