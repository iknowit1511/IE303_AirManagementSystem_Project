import React from "react";
import { IoSearch } from "react-icons/io5";



const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
      />
    </div>
  );
};


export default SearchBar;