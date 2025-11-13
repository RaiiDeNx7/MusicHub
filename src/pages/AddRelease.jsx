// src/pages/AddRelease.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export default function AddRelease() {
  const session = useSession();
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase.from("artists").select("id,name");
      setArtists(data || []);
    };
    fetchArtists();
  }, []);

  if (!session) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Please log in to add releases.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artistId) return alert("Select an artist");

    let coverUrl = null;
    if (coverFile) {
      const { data, error } = await supabase.storage
        .from("release-covers")
        .upload(`covers/${Date.now()}_${coverFile.name}`, coverFile);
      if (error) return alert(error.message);
      coverUrl = data.path;
    }

    const { data: release, error: releaseError } = await supabase
      .from("releases")
      .insert([{ title, artist_id: artistId, cover_image: coverUrl }])
      .select()
      .single();
    if (releaseError) return alert(releaseError.message);

    if (audioFile) {
      const { data, error } = await supabase.storage
        .from("audio-files")
        .upload(`tracks/${Date.now()}_${audioFile.name}`, audioFile);
      if (error) return alert(error.message);

      await supabase.from("tracks").insert([
        { release_id: release.id, title: audioFile.name, audio_url: data.path }
      ]);
    }

    alert("Release added successfully!");
    setTitle("");
    setArtistId("");
    setCoverFile(null);
    setAudioFile(null);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Add Release</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Release Title" required />
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)} required>
          <option value="">Select Artist</option>
          {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
        <input type="file" onChange={(e) => setAudioFile(e.target.files[0])} />
        <button type="submit" className="primary-btn">Add Release</button>
      </form>
    </div>
  );
}
