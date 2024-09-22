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
      <tr className="clientBodyRow">
        <td>{clientName}</td>
        <td>{client.username}</td>
        <td>{clientStage}</td>
        <td>{url?.newURL}</td>
        <td>
          <CopyToClipboard text={url?.newURL}>
            <button>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </CopyToClipboard>
        </td>
        <RefreshButton url={url} />
        <td>
          <button onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  }

  return content;
};

export default Client;
