//list of all clients
//is a table
//Client Name | Assigned User | Stage | Link | Copy | Refresh | Edit
//Link => pull from list of urls => allows state to update with a refresh
import { useGetClientsQuery } from "./clientsApiSlice";
import { useGetUrlsQuery } from "../urls/urlApiSlice";
import { useState } from "react";
import Client from "./Client";
import PulseLoader from "react-spinners/PulseLoader";
import SearchBar from "../../components/SearchBar";
import useTitle from "../../hooks/useTitle";

const ClientList = () => {
  const [search, setSearch] = useState("");
  useTitle("Client List");

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

  let content;
  if (isLoading || isUrlLoading) content = <PulseLoader color={"#000"} />;

  if (isError || isUrlError)
    content = <p>{error?.data?.message || urlError?.data?.message}</p>;

  if (isSuccess && isUrlSuccess) {
    const { ids, entities: clientEntities } = clients;
    const { entities } = urls;
    const urlEntityArray = Object.values(entities);

    const filteredClients = ids.filter(
      (clientId) =>
        clientEntities[clientId].firstName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        clientEntities[clientId].lastName
          .toLowerCase()
          .includes(search.toLowerCase())
    );

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
              Client Name
            </th>
            <th scope="col" className="clientHeaderCell">
              User
            </th>
            <th scope="col" className="clientHeaderCell">
              Stage
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
        {content}
      </div>
    </main>
  );
};

export default ClientList;
