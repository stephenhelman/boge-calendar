import { PulseLoader } from "react-spinners";
import NewClientForm from "./NewClientForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";

const NewClient = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(
    ("usersList",
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    })
  );
  useTitle("New Client Form");

  let content;

  if (isLoading) content = <PulseLoader color={"#000"} />;

  if (isError) content = <p>{error}</p>;

  if (isSuccess) {
    const { entities } = users;
    const entityArray = Object.values(entities);
    content = <NewClientForm users={entityArray} />;
  }
  return content;
};

export default NewClient;
