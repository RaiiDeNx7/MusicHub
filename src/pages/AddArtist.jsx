// src/pages/AddArtist.jsx
import { useState } from "react";
import { supabase } from "../supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export default function AddArtist() {
  const session = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);

  if (!session) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Please log in to add artists.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("artist-images")
        .upload(`artists/${Date.now()}_${imageFile.name}`, imageFile);
      if (error) return alert(error.message);
      imageUrl = data.path;
    }

    const { error } = await supabase.from("artists").insert([{ name, bio, profile_image: imageUrl }]);
    if (error) alert(error.message);
    else {
      alert("Artist added!");
      setName("");
      setBio("");
      setImageFile(null);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Add Artist</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Artist Name" required />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Artist Bio" />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit" className="primary-btn">Add Artist</button>
      </form>
    </div>
  );
}
