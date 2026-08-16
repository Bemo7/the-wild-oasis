import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options, value }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || value;

  function handleChange(event) {
    const selectedValue = event.target.value;

    searchParams.set("sortBy", selectedValue);
    setSearchParams(searchParams);
  }

  return (
    <Select options={options} value={currentSortBy} onChange={handleChange} />
  );
}

export default SortBy;
