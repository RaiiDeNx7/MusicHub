// src/pages/AddRelease.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function AddRelease() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artistId, setArtistId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch artists list
  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (error) console.error(error);
      else setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artistId || !year) return alert("Title, Artist, and Year are required");

    setLoading(true);

    // Make sure user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return alert("You must be logged in to upload files.");
    }

    let coverUrl = null;
    let audioUrl = null;

    // Upload Cover Image
    if (coverFile) {
      const filePath = `covers/${Date.now()}-${coverFile.name}`;
      const { error: coverError } = await supabase.storage
        .from("release-covers")
        .upload(filePath, coverFile, { upsert: true });
      if (coverError) {
        setLoading(false);
        return alert("Error uploading cover image: " + coverError.message);
      }
      const { data: urlData } = supabase.storage
        .from("release-covers")
        .getPublicUrl(filePath);
      coverUrl = urlData.publicUrl;
    }

    // Upload Audio File
    if (audioFile) {
      const filePath = `audio/${Date.now()}-${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("audio-files")
        .upload(filePath, audioFile, { upsert: true });
      if (audioError) {
        setLoading(false);
        return alert("Error uploading audio file: " + audioError.message);
      }
      const { data: urlData } = supabase.storage
        .from("audio-files")
        .getPublicUrl(filePath);
      audioUrl = urlData.publicUrl;
    }

    // Insert Release into DB
    const { error: insertError } = await supabase.from("releases").insert({
      title,
      description,
      artist_id: artistId,
      year,
      cover_image: coverUrl,
      audio_url: audioUrl,
    });

    setLoading(false);

    if (insertError) {
      return alert("Error adding release: " + insertError.message);
    }

    alert("Release added successfully!");
    navigate("/releases");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Add Release</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Artist</label>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} required>
            <option value="">Select an artist</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
        </div>

        <div>
          <label>Audio File</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Release"}
        </button>
      </form>
    </div>
  );
}
