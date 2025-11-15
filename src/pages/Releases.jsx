// src/pages/Releases.jsx
import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function Releases({ limit }) {
  const session = useSession();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReleases() {
      const { data, error } = await supabase
        .from("releases")
        .select(`
          *,
          artists:artist_id (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit || 100);

      if (error) {
        console.error("Error fetching releases:", error);
      } else {
        setReleases(data);
      }

      setLoading(false);
    }

    fetchReleases();
  }, [limit]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", width: "100%" }}>
      {/* Add Release Button */}
      {session && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <Link to="/add-release">
            <button className="primary-btn">Add Release</button>
          </Link>
        </div>
      )}

      {/* Loading / Empty / Releases Grid */}
      {loading ? (
        <p>Loading releases...</p>
      ) : releases.length === 0 ? (
        <p>No releases found.</p>
      ) : (
        <div className="release-grid">
          {releases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      )}
    </div>
  );
}
