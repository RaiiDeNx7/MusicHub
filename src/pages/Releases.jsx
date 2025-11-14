import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function Releases({ limit }) {
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

  if (loading) return <p>Loading releases...</p>;
  if (releases.length === 0) return <p>No releases found.</p>;

  return (
    <div className="release-grid">
      {releases.map((release) => (
        <ReleaseCard key={release.id} release={release} />
      ))}
    </div>
  );
}
