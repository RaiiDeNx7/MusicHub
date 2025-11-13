// src/pages/AddRelease.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function AddRelease() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artistId, setArtistId] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (error) console.error(error);
      else setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleCoverChange = (e) => setCoverFile(e.target.files[0]);
  const handleAudioChange = (e) => setAudioFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artistId) return alert("Title and Artist are required");
    setLoading(true);

    // Upload cover image
    let coverUrl = null;
    if (coverFile) {
      const { error: coverError } = await supabase.storage
        .from("release-covers")
        .upload(`public/${coverFile.name}`, coverFile, { upsert: true });
      if (coverError) {
        setLoading(false);
        return alert("Error uploading cover image: " + coverError.message);
      }
      coverUrl = `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/release-covers/public/${coverFile.name}`;
    }

    // Upload audio file
    let audioUrl = null;
    if (audioFile) {
      const { error: audioError } = await supabase.storage
        .from("audio-files")
        .upload(`public/${audioFile.name}`, audioFile, { upsert: true });
      if (audioError) {
        setLoading(false);
        return alert("Error uploading audio file: " + audioError.message);
      }
      audioUrl = `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/audio-files/public/${audioFile.name}`;
    }

    // Insert into releases table
    const { data, error } = await supabase.from("releases").insert({
      title,
      description,
      artist_id: artistId,
      cover_image: coverUrl,
      audio_url: audioUrl,
    });

    setLoading(false);
    if (error) return alert("Error adding release: " + error.message);
    alert("Release added!");
    navigate("/releases");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Add Release</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Artist</label>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} required>
            <option value="">Select an artist</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </div>

        <div>
          <label>Audio File</label>
          <input type="file" accept="audio/*" onChange={handleAudioChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Release"}
        </button>
      </form>
    </div>
  );
}
