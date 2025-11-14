import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: artistData } = await supabase
        .from("artists")
        .select("*")
        .eq("id", id)
        .single();

      const { data: releaseData } = await supabase
        .from("releases")
        .select("*")
        .eq("artist_id", id);

      setArtist(artistData);
      setReleases(releaseData);
    }
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this artist?")) return;
    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (error) return alert(error.message);
    alert("Artist deleted!");
    navigate("/"); // redirect to homepage after deletion
  };

  if (!artist) return <p>Loading...</p>;

  return (
    <div className="artist-page">
      <div className="artist-header">
        <img
          src={artist.profile_image}
          alt={artist.name}
          className="artist-photo"
        />
        <div className="artist-info">
          <h2>{artist.name}</h2>
          <p className="artist-bio">{artist.bio}</p>

          {/* Edit & Delete Buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button
              className="primary-btn"
              onClick={() => navigate(`/artist/edit/${id}`)}
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

      <h3 className="section-title">Releases</h3>
      <div className="release-grid">
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>
    </div>
  );
}
