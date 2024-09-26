import NewButton from "./NewButton";
const SearchBar = ({ state, setState }) => {
  const handleChange = (e) => setState(e.target.value);

  return (
    <>
      <input type="text" value={state} onChange={handleChange} />
      <NewButton />
    </>
  );
};

export default SearchBar;
