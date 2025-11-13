import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import ArtistCard from "../components/ArtistCard";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (error) console.error(error);
      else setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleAddArtist = async (e) => {
    e.preventDefault();
    let profileUrl = "";

    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("artist-images")
        .upload(`public/${imageFile.name}`, imageFile);

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      profileUrl = supabase.storage.from("artist-images").getPublicUrl(data.path).data.publicUrl;
    }

    const { data, error } = await supabase.from("artists").insert({
      name,
      bio,
      profile_image: profileUrl,
    });

    if (error) console.error("Insert error:", error);
    else setArtists((prev) => [...prev, data[0]]);
    
    setName("");
    setBio("");
    setImageFile(null);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2>Add Artist</h2>
      <form onSubmit={handleAddArtist} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit">Add Artist</button>
      </form>

      <h2>All Artists</h2>
      {artists.length > 0 ? (
        <div className="artist-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <p>No artists found.</p>
      )}
    </div>
  );
}
