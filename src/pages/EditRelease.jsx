import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function EditRelease() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artistId, setArtistId] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: artistData } = await supabase.from("artists").select("*");
      setArtists(artistData || []);

      const { data: releaseData } = await supabase
        .from("releases")
        .select("*")
        .eq("id", id)
        .single();

      if (releaseData) {
        setTitle(releaseData.title);
        setDescription(releaseData.description);
        setArtistId(releaseData.artist_id);
      }
    };
    fetchData();
  }, [id]);

  const handleCoverChange = (e) => setCoverFile(e.target.files[0]);
  const handleAudioChange = (e) => setAudioFile(e.target.files[0]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    const { error: updateError } = await supabase
      .from("releases")
      .update({
        title,
        description,
        artist_id: artistId,
        ...(coverUrl && { cover_image: coverUrl }),
        ...(audioUrl && { audio_url: audioUrl }),
      })
      .eq("id", id);

    setLoading(false);
    if (updateError) return alert("Error updating release: " + updateError.message);
    alert("Release updated!");
    navigate(`/release/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this release?")) return;

    const { error } = await supabase.from("releases").delete().eq("id", id);
    if (error) return alert("Error deleting release: " + error.message);
    alert("Release deleted!");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Edit Release</h2>
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Artist</label>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} required>
            <option value="">Select an artist</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
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
          {loading ? "Updating..." : "Update Release"}
        </button>
        <button type="button" onClick={handleDelete} style={{ background: "red", color: "white" }}>
          Delete Release
        </button>
      </form>
    </div>
  );
}
