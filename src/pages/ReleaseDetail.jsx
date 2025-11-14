import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import AudioPlayer from "../components/AudioPlayer";

export default function ReleaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this release?")) return;
    const { error } = await supabase.from("releases").delete().eq("id", id);
    if (error) return alert(error.message);
    alert("Release deleted!");
    navigate("/"); // go to homepage after deletion
  };

  if (!release) return <p>Loading...</p>;

  return (
    <div className="release-detail-page">
      <div className="release-detail-header">
        <img
          src={release.cover_image}
          alt={release.title}
          className="release-banner"
        />

        <div className="release-detail-info" style={{ textAlign: "center" }}>
          <h2>{release.title}</h2>
          <p className="release-artist">{release.artists?.name}</p>
          <p>{release.description}</p>

          {/* Edit & Delete Buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button
              className="primary-btn"
              onClick={() => navigate(`/release/edit/${id}`)}
            >
              Edit
            </button>
            <button
              className="primary-btn"
              style={{ marginLeft: "1rem", background: "red", color: "white" }}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ textAlign: "center", marginTop: "2rem" }}>Listen</h3>
      {release.audio_url ? (
        <AudioPlayer track={{ audio_url: release.audio_url }} />
      ) : (
        <p style={{ textAlign: "center" }}>No audio available.</p>
      )}
    </div>
  );
}
