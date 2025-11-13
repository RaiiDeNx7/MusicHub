import React, { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

export default function AddArtist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setErrorMsg("Artist name is required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    let profileUrl = null;

    // 1️⃣ Upload profile image
    if (profileFile) {
      try {
        const fileExt = profileFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from("artist-images")
          .upload(fileName, profileFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Generate public URL (or use signed URL if bucket is private)
        const { publicUrl, error: urlError } = supabase.storage
          .from("artist-images")
          .getPublicUrl(fileName);

        if (urlError) throw urlError;

        profileUrl = publicUrl;
      } catch (err) {
        console.error("Upload error:", err);
        setErrorMsg(`Error uploading image: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    // 2️⃣ Insert artist row
    try {
      const { data: insertData, error: insertError } = await supabase
        .from("artists")
        .insert({
          name,
          bio,
          profile_image: profileUrl,
        })
        .select();

      if (insertError) throw insertError;

      setLoading(false);
      navigate("/artists"); // redirect to artists page
    } catch (err) {
      console.error("Insert error:", err);
      setErrorMsg(`Error adding artist: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Add Artist</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Artist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Artist"}
        </button>
      </form>
    </div>
  );
}
