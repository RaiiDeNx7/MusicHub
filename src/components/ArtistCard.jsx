import { Link } from "react-router-dom";

export default function ArtistCard({ artist }) {
  return (
    <div className="artist-card">
      <img src={artist.profile_image} alt={artist.name} />
      <h3>{artist.name}</h3>
      <Link to={`/artist/${artist.id}`}>View Profile</Link>
    </div>
  );
}
