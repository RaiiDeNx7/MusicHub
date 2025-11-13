import { Link } from "react-router-dom";

export default function ArtistCard({ artist }) {
  return (
    <div className="artist-card">
      <img src={artist.image_url} alt={artist.name} />
      <h3>{artist.name}</h3>
      <p>{artist.genre}</p>
      <Link to={`/artist/${artist.id}`}>View Profile</Link>
    </div>
  );
}
