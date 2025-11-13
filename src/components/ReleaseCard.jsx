import { Link } from "react-router-dom";

export default function ReleaseCard({ release }) {
  return (
    <div className="release-card">
      <img src={release.cover_image} alt={release.title} />
      <h4>{release.title}</h4>
      <p>{release.artist_name}</p>
      <Link to={`/release/${release.id}`}>Details</Link>
    </div>
  );
}
