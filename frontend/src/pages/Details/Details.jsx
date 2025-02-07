  import { useEffect, useState } from "react";
  import { useParams, Link } from "react-router-dom";
  import styles from "./Details.module.css";

  export default function Details() {
    const { category, id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

      //Fetch des détails
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://swapi.dev/api/${category}/${id}/`);
          if (!response.ok) throw new Error("Failed to fetch details");
      
          const data = await response.json();
      
          // Fields that contain URLs
          const keysToExpand = ["homeworld", "films", "species", "vehicles",
            "starships", "people", "residents", "planets", "characters"];
          
          const updatedData = { ...data };
      
          // Fetch all linked data
          await Promise.all(
            keysToExpand.map(async (key) => {
              if (data[key]) {
                if (Array.isArray(data[key])) {
                  // ✅ Fetch all linked items in an array
                  const results = await Promise.all(data[key].map((url) => fetch(url).then((res) => res.json())));
                  updatedData[key] = results.map((item, index) => ({
                    name: item.name || item.title,
                    url: data[key][index] // ✅ Ensure we keep the original URL
                  }));
                } else {
                  // ✅ Ensure we store an object with `name` and `url`
                  const result = await fetch(data[key]).then((res) => res.json());
                  updatedData[key] = { name: result.name || result.title, url: data[key] };
                }
              }
            })
          );
      
          setDetails(updatedData);
        } catch (error) {
          setError(error.message);
        }
        setLoading(false);
      };


      fetchDetails();
    }, [category, id]);

    const extractIdFromUrl = (url) => {
      const match = url.match(/\/(\d+)\/$/);
      return match ? match[1] : null;
    };

    if (loading) return <p className={styles.loading}>Loading at light speed...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;
    if (!details) return <p>No details found.</p>;

    return (
  <div className={styles.container}>
    <h1 className={styles.title}>{details.name || details.title}</h1>
    <div className={styles.detailsCard}>
      {Object.entries(details).map(([key, value]) => {
        if (["created", "edited", "url"].includes(key)) return null; // Hide unnecessary fields

        return (
          <p key={key} className={styles.detail}>
            <span className={styles.label}>{key.replace(/_/g, " ").toUpperCase()}:</span>{" "}
            {Array.isArray(value) ? (
              value.length > 0 ? ( // ✅ Ensure array is not empty
                value.map((item, index) =>
                  item.url ? (
                    <Link key={index} to={`/details/${item.url.split("/")[4]}/${extractIdFromUrl(item.url)}`} className={styles.link}>
                      {item.name}
                    </Link>
                  ) : (
                    <span key={index}>{item.name}</span>
                  )
                ).reduce((prev, curr) => [prev, ", ", curr])
              ) : (
                "None" // ✅ Show "None" if the array is empty
              )
            ) : value.url ? (
              // ✅ Handle single linked values
              <Link to={`/details/${value.url.split("/")[4]}/${extractIdFromUrl(value.url)}`} className={styles.link}>
                {value.name}
              </Link>
            ) : (
              value
            )}
          </p>
        );
      })}
    </div>
  </div>
);
  }