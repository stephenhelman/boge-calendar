import NewButton from "./NewButton";
const SearchBar = ({ state, setState }) => {
  const handleChange = (e) => setState(e.target.value);

  return (
    <div>
      <input type="text" value={state} onChange={handleChange} />
      <NewButton />
    </div>
  );
};

export default SearchBar;
