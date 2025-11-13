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
    <div>
      <h2>{artist.name}</h2>
      <p>{artist.bio}</p>
      <h3>Releases</h3>
      <div className="grid">
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>
    </div>
  );
}
