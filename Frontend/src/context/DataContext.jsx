import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

export default function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [val, setVal] = useState("All"); // default category

  useEffect(() => {
    fetchAllData(val);
  }, [val]);

  const fetchAllData = async (category) => {
    const query = category === "All" ? "New" : category;

    try {
      setLoading(true);

      // 1️⃣ fetch existing videos
      let res = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
      let videos = res.data;

      // 2️⃣ seed if empty
      if (!videos || videos.length === 0) {
        console.log(`No videos for query "${query}", seeding now...`);
        await axios.post(`http://localhost:5000/api/videos/seed?query=${query}`);

        // fetch again after seeding
        res = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
        videos = res.data;
      }

      setData(videos);
    } catch (err) {
      console.error("Error fetching backend data:", err.message);
      setData([]); // ensure state is reset on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ loading, data, val, setVal }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
