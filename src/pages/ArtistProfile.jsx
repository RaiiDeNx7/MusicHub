import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function ArtistProfile() {
  const { id } = useParams();
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
