import { useState, useEffect } from "react";
import {
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "./clientsApiSlice";
import { useUpdateUrlMutation } from "../urls/urlApiSlice";
import { useNavigate } from "react-router-dom";
import { stages } from "../../config/stages";
import useAuth from "../../hooks/useAuth";

const EditClientForm = ({ client, users }) => {
  const { isAdmin, id } = useAuth();
  const navigate = useNavigate();

  const [updateClient, { isLoading, isSuccess, isError, error }] =
    useUpdateClientMutation();

  const [
    deleteClient,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteClientMutation();

  const [updateUrl] = useUpdateUrlMutation();

  const [firstName, setFirstName] = useState(client.firstName);
  const [lastName, setLastName] = useState(client.lastName);
  const [userId, setUserId] = useState(client.user);
  const [stage, setStage] = useState(client.stage);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setFirstName("");
      setLastName("");
      setUserId("");
      setStage("");
      navigate("/home/clients");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const errorContent = (error?.data?.message || delError?.data?.message) ?? "";

  const nonAdminUser = users.filter((user) => user.id === id);

  const options = users.map((user) => {
    return <option key={user.id} value={user.id} />;
  });

  const userSelection = (
    <div>
      <label htmlFor="user">Assigned User:</label>
      {isAdmin ? (
        <select value={userId} onChange={handleUserIdChanged}>
          {options}
        </select>
      ) : (
        <input
          type="text"
          id="user"
          value={nonAdminUser[0].username}
          readOnly={true}
        />
      )}
    </div>
  );

  const stageSelection = Object.entries(stages).map((key, i) => {
    return (
      <option key={i} value={key[0]}>
        {key[1]}
      </option>
    );
  });

  const handleFirstNameChanged = (e) => setFirstName(e.target.value);
  const handleLastNameChanged = (e) => setLastName(e.target.value);
  const handleUserIdChanged = (e) => setUserId(e.target.value);
  const handleStageChanged = (e) => setStage(e.target.value);

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    const selectedUser = users.filter((user) => user.id === userId);
    const { calendarLinks } = selectedUser[0];

    //determine if the stage has changed. If so, we need to create a new link
    if (stage !== client.stage) {
      await updateUrl({
        id: client.linkId,
        originalUrl: calendarLinks[stage],
        stage: stage,
      });
    }
    await updateClient({
      id: client.id,
      firstName: firstName,
      lastName: lastName,
      user: userId,
      stage: stage,
    });
  };

  const content = (
    <>
      <p>{errorContent}</p>

      <form onSubmit={handleUpdateClient} className="welcomeContainer">
        <div>
          <label htmlFor="firstName">Client First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChanged}
          />
        </div>
        <div>
          <label htmlFor="lastName">Client Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChanged}
          />
        </div>
        <div>
          <label htmlFor="stage">Client Stage:</label>
          <select id="stage" value={stage} onChange={handleStageChanged}>
            {stageSelection}
          </select>
        </div>
        {userSelection}
        <button>Submit</button>
      </form>
    </>
  );

  return content;
};

export default EditClientForm;
