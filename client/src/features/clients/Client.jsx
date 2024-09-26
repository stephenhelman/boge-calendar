import { useGetClientsQuery } from "./clientsApiSlice";
import { stages } from "../../config/stages";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import RefreshButton from "../urls/RefreshButton";

const Client = ({ clientId, url }) => {
  const { client } = useGetClientsQuery("clientsList", {
    selectFromResult: ({ data }) => ({
      client: data?.entities[clientId],
    }),
  });
  const navigate = useNavigate();
  const handleEdit = () => navigate(`/home/clients/${client.id}`);

  let content;

  if (client) {
    const clientName = `${client.firstName} ${client.lastName}`;
    const clientStage = stages[client.stage];
    content = (
      <div className="clientCard">
        <div className="clientContainer">
          <div className="clientInformation">
            <div className="clientNameContainer">
              <h2 className="clientName">{clientName}</h2>
              <button className="edit" title="edit client" onClick={handleEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
            <div className="clientLinkContainer">
              <p>{url?.newURL}</p>
              <CopyToClipboard text={url?.newURL}>
                <button title="copy link">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </CopyToClipboard>
              <RefreshButton url={url} />
            </div>
          </div>
          <div className="userInfo">
            <p className="username">{client.username}</p>
            <p className="stage">{clientStage}</p>
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default Client;
