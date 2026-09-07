export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="🔍 Search transaction..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
