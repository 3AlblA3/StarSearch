import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);

    // Fetch de toutes les entités
    try {
      const response = await fetch(`http://localhost:3000/search-all`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      let filteredResults = [];

      // Si on fait une recherche globale, afficher tout les élémeents
      if (category === "all") {
        Object.keys(data).forEach((key) => {
          if (data[key]?.results) {
            data[key].results.forEach((item, index) => {
              filteredResults.push({ ...item, category: key, index: index + 1 });
            });
          }
        });
        // Sinon, afficher par catégorie
      } else {
        filteredResults =
          data[category]?.results?.map((item, index) => ({
            ...item,
            category,
            index: index + 1,
          })) || [];
      }

      // On filtre les éléments par noms ou par titre 
      const finalResults = filteredResults.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setResults(finalResults);
    } catch (error) {
      console.error("Search error:", error);
    }

    setLoading(false);
    setHasSearched(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
          <option value="all">All Categories</option>
          <option value="people">People</option>
          <option value="planets">Planets</option>
          <option value="starships">Spaceships</option>
          <option value="vehicles">Vehicles</option>
          <option value="species">Species</option>
          <option value="films">Films</option>
        </select>
        <button onClick={handleSearch} className={styles.button}>
          Search
        </button>
      </div>

      {loading ? <p>Loading at light speed...</p> : null}

      <div className={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((item) => (
            <div
              key={item.index}
              className={styles.card}
              onClick={() => navigate(`/details/${item.category}/${item.index}`)}
            >
              <h3>{item.name || item.title}</h3>
              <p>Click for more details</p>
            </div>
          ))
        ) : hasSearched ? ( 
          <p>No results found.</p>
        ) : null}
      </div>
    </div>
  );
}
