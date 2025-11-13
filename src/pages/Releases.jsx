// src/pages/Releases.jsx
import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function Releases() {
  const session = useSession();
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    const fetchReleases = async () => {
      const { data, error } = await supabase.from("releases").select("*");
      if (error) console.error(error);
      else setReleases(data);
    };
    fetchReleases();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", width: "100%" }}>
      {session && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <Link to="/add-release">
            <button className="primary-btn">Add Release</button>
          </Link>
        </div>
      )}

      {releases.length > 0 ? (
        <div className="release-grid">
          {releases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <p>No releases found.</p>
      )}
    </div>
  );
}
