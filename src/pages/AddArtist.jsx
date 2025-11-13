// src/pages/AddArtist.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function AddArtist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Name is required");
    setLoading(true);

    let profileUrl = null;
    if (imageFile) {
      const { data, error: uploadError } = await supabase.storage
        .from("artist-images")
        .upload(`public/${imageFile.name}`, imageFile);

      if (uploadError) {
        setLoading(false);
        return alert("Error uploading image: " + uploadError.message);
      }

      profileUrl = `https://hscgdsmflpzrjzvltxlc.supabase.co/storage/v1/object/public/artist-images/public/${imageFile.name}`;
    }

    const { data, error } = await supabase.from("artists").insert({
      name,
      bio,
      profile_image: profileUrl
    });

    setLoading(false);

    if (error) return alert("Error adding artist: " + error.message);
    alert("Artist added successfully!");
    navigate("/artists");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Add Artist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div>
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Artist"}
        </button>
      </form>
    </div>
  );
}
