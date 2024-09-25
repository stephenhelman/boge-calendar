//list of all clients
//is a table
//Client Name | Assigned User | Stage | Link | Copy | Refresh | Edit
//Link => pull from list of urls => allows state to update with a refresh
import { useGetClientsQuery } from "./clientsApiSlice";
import { useGetUrlsQuery } from "../urls/urlApiSlice";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Client from "./Client";
import PulseLoader from "react-spinners/PulseLoader";
import SearchBar from "../../components/SearchBar";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";

const ClientList = () => {
  const [search, setSearch] = useState("");
  useTitle("Client List");
  const { id, isAdmin } = useAuth();
  const [userId, setUserId] = useState(!isAdmin ? id : "");
  const [sortList, setSortList] = useState("");
  const [direction, setDirection] = useState(true);

  const {
    data: clients,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetClientsQuery("clientsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: urls,
    isLoading: isUrlLoading,
    isSuccess: isUrlSuccess,
    isError: isUrlError,
    error: urlError,
  } = useGetUrlsQuery("urlsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleResetSort = () => {
    setSortList("");
    setDirection(true);
  };

  const resetButton = <button onClick={handleResetSort}>Reset</button>;

  let content;
  if (isLoading || isUrlLoading) content = <PulseLoader color={"#000"} />;

  if (isError || isUrlError)
    content = <p>{error?.data?.message || urlError?.data?.message}</p>;

  if (isSuccess && isUrlSuccess) {
    const { ids, entities: clientEntities } = clients;
    const { entities } = urls;
    const urlEntityArray = Object.values(entities);
    const ascendingArrow = <FontAwesomeIcon icon={faArrowUp} />;
    const descendingArrow = <FontAwesomeIcon icon={faArrowDown} />;

    const filteredClientsByUser = ids.filter(
      (clientId) => clientEntities[clientId].user === userId
    );

    let sortedClients;

    switch (sortList) {
      case "client":
        sortedClients = filteredClientsByUser.sort((a, b) => {
          const clientA = clientEntities[a];
          const clientB = clientEntities[b];
          if (!direction) {
            return clientA.firstName.localeCompare(clientB.firstName);
          }
          return clientB.firstName.localeCompare(clientA.firstName);
        });
        break;
      case "stage":
        sortedClients = filteredClientsByUser.sort((a, b) => {
          const clientA = clientEntities[a];
          const clientB = clientEntities[b];
          if (!direction) {
            return clientA.stage.localeCompare(clientB.stage);
          }
          return clientB.stage.localeCompare(clientA.stage);
        });
        break;
      default:
        if (direction) {
          sortedClients = filteredClientsByUser.reverse();
        }
        sortedClients = filteredClientsByUser;
        break;
    }

    const filteredClients = sortedClients.filter(
      (clientId) =>
        clientEntities[clientId].firstName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        clientEntities[clientId].lastName
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    const handleSortByClientName = () => {
      if (sortList !== "client") {
        setSortList("client");
        setDirection(false);
      }
      setDirection((prev) => !prev);
    };

    const handleSortByStage = () => {
      if (sortList !== "stage") {
        setSortList("stage");
        setDirection(false);
      }
      setDirection((prev) => !prev);
    };

    let clientFilterButton;
    if (sortList === "client") {
      if (direction) {
        clientFilterButton = (
          <button onClick={handleSortByClientName}>
            Client name {ascendingArrow}
          </button>
        );
      } else {
        clientFilterButton = (
          <button onClick={handleSortByClientName}>
            Client name {descendingArrow}
          </button>
        );
      }
    } else {
      clientFilterButton = (
        <button onClick={handleSortByClientName}>Client name</button>
      );
    }

    let stageFilterButton;
    if (sortList === "stage") {
      if (direction) {
        stageFilterButton = (
          <button onClick={handleSortByStage}>Stage {ascendingArrow}</button>
        );
      } else {
        stageFilterButton = (
          <button onClick={handleSortByStage}>Stage {descendingArrow}</button>
        );
      }
    } else {
      stageFilterButton = <button onClick={handleSortByStage}>Stage</button>;
    }

    const tableContent =
      ids?.length &&
      filteredClients.map((clientId) => {
        const clientUrl = urlEntityArray.filter(
          (url) => url.clientId === clientId
        );
        return <Client key={clientId} clientId={clientId} url={clientUrl[0]} />;
      });
    content = (
      <table className="clientTable">
        <thead className="clientHeader">
          <tr className="clientHeaderRow">
            <th scope="col" className="clientHeaderCell">
              {clientFilterButton}
            </th>
            <th scope="col" className="clientHeaderCell">
              User
            </th>
            <th scope="col" className="clientHeaderCell">
              {stageFilterButton}
            </th>
            <th scope="col" className="clientHeaderCell">
              Link
            </th>
            <th scope="col" className="clientHeaderCell">
              Copy
            </th>
            <th scope="col" className="clientHeaderCell">
              Refresh
            </th>
            <th scope="col" className="clientHeaderCell">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="clientBody">{tableContent}</tbody>
      </table>
    );
  }

  return (
    <main>
      <div className="container tableContainer">
        <SearchBar state={search} setState={setSearch} />
        {resetButton}
        {content}
      </div>
    </main>
  );
};

export default ClientList;
