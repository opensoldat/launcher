import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./SearchBar.css";

type SearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;

  placeholder: string;
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    props.onChange(event.target.value);
  };

  return (
    <label className={`search-bar ${props.className || ""}`}>
      <FontAwesomeIcon icon={faSearch} />
      <input
        className="search-input"
        placeholder={props.placeholder}
        spellCheck="false"
        type="search"
        value={props.value}
        onChange={handleInputChange}
      ></input>
    </label>
  );
};

export default SearchBar;
