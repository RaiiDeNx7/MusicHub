import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function EditArtist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchArtist() {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return console.error(error);
      setName(data.name);
      setBio(data.bio);
    }
    fetchArtist();
  }, [id]);

  const handleProfileChange = (e) => setProfileFile(e.target.files[0]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profileUrl = null;

    if (profileFile) {
      const { error: uploadError } = await supabase.storage
        .from("artist-profiles")
        .upload(`public/${profileFile.name}`, profileFile, { upsert: true });
      if (uploadError) {
        setLoading(false);
        return alert("Error uploading profile image: " + uploadError.message);
      }
      profileUrl = `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/artist-profiles/public/${profileFile.name}`;
    }

    const { error: updateError } = await supabase
      .from("artists")
      .update({ name, bio, ...(profileUrl && { profile_image: profileUrl }) })
      .eq("id", id);

    setLoading(false);
    if (updateError) return alert("Error updating artist: " + updateError.message);
    alert("Artist updated!");
    navigate(`/artist/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this artist?")) return;

    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (error) return alert("Error deleting artist: " + error.message);
    alert("Artist deleted!");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Edit Artist</h2>
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div>
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleProfileChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Artist"}
        </button>
        <button type="button" onClick={handleDelete} style={{ background: "red", color: "white" }}>
          Delete Artist
        </button>
      </form>
    </div>
  );
}
