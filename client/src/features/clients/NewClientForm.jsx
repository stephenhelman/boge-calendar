import { useState, useEffect } from "react";
import {
  useUpdateClientMutation,
  useAddNewClientMutation,
} from "./clientsApiSlice";
import { useAddNewUrlMutation } from "../urls/urlApiSlice";
import { useNavigate } from "react-router-dom";
import { stages } from "../../config/stages";
import useAuth from "../../hooks/useAuth";

const NewClientForm = ({ users }) => {
  const { isAdmin, id } = useAuth();
  const navigate = useNavigate();

  const [
    addNewClient,
    {
      isSuccess: isNewClientSuccess,
      isError: isNewClientError,
      error: newClientError,
    },
  ] = useAddNewClientMutation();

  const [
    addNewUrl,
    { isSuccess: isNewUrlSuccess, isError: isNewUrlError, error: newUrlError },
  ] = useAddNewUrlMutation();

  const [
    updateClient,
    { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError },
  ] = useUpdateClientMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [stage, setStage] = useState("initialMeeting");

  useEffect(() => {
    if (isNewClientSuccess && isNewUrlSuccess && isUpdateSuccess) {
      setFirstName("");
      setLastName("");
      setUserId("");
      setStage("");
      navigate("/home/clients");
    }
  }, [isNewClientSuccess, isNewUrlSuccess, isUpdateSuccess, navigate]);

  const errorContent =
    (newClientError?.data?.message ||
      newUrlError?.data?.message ||
      updateError?.data?.message) ??
    "";

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

  const handleAddNewClient = async (e) => {
    e.preventDefault();
    const selectedUser = isAdmin
      ? users.filter((user) => user.id === userId)
      : nonAdminUser;
    const {
      calendarLinks,
      id: selectedUserId,
      linkExpiration,
    } = selectedUser[0];
    //create the new client
    const newClient = await addNewClient({
      firstName: firstName,
      lastName: lastName,
      user: selectedUserId,
      stage: stage,
    });
    console.log("Client Created");
    if (newClient?.error) return;

    //create the url with the client assigned
    const { _id: clientId } = newClient.data.result;
    const newUrl = await addNewUrl({
      originalUrl: calendarLinks[stage],
      expiresIn: linkExpiration,
      stage: stage,
      client: clientId,
    });
    console.log("Url Created");
    const { _id: urlId } = newUrl;

    //assign the url to the client
    await updateClient({
      id: clientId,
      calendarLink: urlId,
    });
    console.log("Client Updated");
  };

  const content = (
    <>
      <p>{errorContent}</p>

      <form onSubmit={handleAddNewClient}>
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

export default NewClientForm;
