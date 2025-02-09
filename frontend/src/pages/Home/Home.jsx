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
    try {
      //Fetch des données
      const response = await fetch(`http://localhost:3000/search-all`, {
        method: "GET",
        credentials: "include",
      });
  
      const data = await response.json();
      let filteredResults = [];
  
      if (category === "all") {
        // Fetch de toutes les données et classer par catégorie
        Object.keys(data).forEach((key) => {
          if (data[key]?.results) {
            data[key].results.forEach((item) => {
              // Extraction de l'id dans SWAPI
              const realId = item.url.match(/\/(\d+)\/$/)[1];
              filteredResults.push({ ...item, category: key, id: realId });
            });
          }
        });
      } else {
        // Filtrer les résultats par catégorie
        filteredResults = data[category]?.results?.map((item) => {
          const realId = item.url.match(/\/(\d+)\/$/)[1];
          return { ...item, category, id: realId };
        }) || [];
      }
  
            // Filtrage des résultats en fonction du terme de recherche
      const finalResults = filteredResults.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
       // Mise à jour des résultats affichés
      setResults(finalResults);
    } catch (error) {
      console.error("Search error:", error);
    }
  
    setLoading(false);
    setHasSearched(true);
  };
  

  // Filtrer les résultats dynamiquement avec le select roll
  const displayedResults = category === "all"
    ? results
    : results.filter((item) => item.category === category);

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
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className={styles.select}
        >
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
        {displayedResults.length > 0 ? (
          displayedResults.map((item) => (
            <div
              key={item.id} //
              className={styles.card}
              onClick={() => navigate(`/details/${item.category}/${item.id}`)} 
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
