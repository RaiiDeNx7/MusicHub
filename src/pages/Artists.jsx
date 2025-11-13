// src/pages/Artists.jsx
import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import ArtistCard from "../components/ArtistCard";

export default function Artists() {
  const session = useSession();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (error) console.error(error);
      else setArtists(data);
    };
    fetchArtists();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", width: "100%" }}>
      {session && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <Link to="/add-artist">
            <button className="primary-btn">Add Artist</button>
          </Link>
        </div>
      )}

      {artists.length > 0 ? (
        <div className="artist-grid">
          {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      ) : (
        <p>No artists found.</p>
      )}
    </div>
  );
}
