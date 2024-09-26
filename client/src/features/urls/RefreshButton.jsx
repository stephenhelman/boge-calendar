import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useRefreshRedirectMutation } from "./urlApiSlice";

const RefreshButton = ({ url }) => {
  if (!url) {
    return <td></td>;
  }
  const { urlId, id } = url;
  const [refreshRedirect] = useRefreshRedirectMutation();
  const handleRefresh = async () => {
    await refreshRedirect({ id: urlId, urlId: id });
  };

  return (
    <td>
      <button title="refresh link" onClick={handleRefresh}>
        <FontAwesomeIcon icon={faRefresh} />
      </button>
    </td>
  );
};

export default RefreshButton;
