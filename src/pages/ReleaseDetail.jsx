import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import AudioPlayer from "../components/AudioPlayer";

export default function ReleaseDetail() {
  const { id } = useParams();
  const [release, setRelease] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("releases")
        .select(`
          *,
          artists (
            id,
            name
          )
        `)
        .eq("id", id)
        .single();

      setRelease(data);
    }
    fetchData();
  }, [id]);

  if (!release) return <p>Loading...</p>;

  return (
    <div className="release-detail-page">
      <div className="release-detail-header">
        <img
          src={release.cover_image}
          alt={release.title}
          className="release-banner"
        />

        <div className="release-detail-info">
          <h2>{release.title}</h2>
          <p className="release-artist">{release.artists?.name}</p>
          <p>{release.description}</p>
        </div>
      </div>

      <h3>Listen</h3>
      {release.audio_url ? (
        <AudioPlayer track={{ audio_url: release.audio_url }} />
      ) : (
        <p>No audio available.</p>
      )}
    </div>
  );
}
