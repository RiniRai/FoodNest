import { FaSearch } from "react-icons/fa";

function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-10">
      <div className="flex items-center bg-white shadow-lg rounded-full px-5 py-4 border border-gray-200">
        <FaSearch className="text-gray-500 text-xl" />

        <input
          type="text"
          placeholder="Search restaurants or dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full ml-4 outline-none text-lg"
        />
      </div>
    </div>
  );
}

export default SearchBar;