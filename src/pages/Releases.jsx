import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import ReleaseCard from "../components/ReleaseCard";

export default function Releases() {
  const [releases, setReleases] = useState([]);
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [coverFile, setCoverFile] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchReleases = async () => {
      const { data, error } = await supabase.from("releases").select("*");
      if (error) console.error(error);
      else setReleases(data);
    };
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (error) console.error(error);
      else setArtists(data);
    };
    fetchReleases();
    fetchArtists();
  }, []);

  const handleAddRelease = async (e) => {
    e.preventDefault();
    let coverUrl = "";

    if (coverFile) {
      const { data, error } = await supabase.storage
        .from("release-covers")
        .upload(`public/${coverFile.name}`, coverFile);

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      coverUrl = supabase.storage.from("release-covers").getPublicUrl(data.path).data.publicUrl;
    }

    const { data, error } = await supabase.from("releases").insert({
      title,
      artist_id: artistId,
      cover_image: coverUrl,
    });

    if (error) console.error("Insert error:", error);
    else setReleases((prev) => [...prev, data[0]]);

    setTitle("");
    setCoverFile("");
    setArtistId("");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2>Add Release</h2>
      <form onSubmit={handleAddRelease} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          required
        >
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
        />
        <button type="submit">Add Release</button>
      </form>

      <h2>All Releases</h2>
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
