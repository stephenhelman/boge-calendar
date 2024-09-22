import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
  const { userId } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  useTitle(`Edit ${user.username}`);

  if (!user) return <PulseLoader color={"#000"} />;
  return <EditUserForm user={user} />;
};

export default EditUser;
