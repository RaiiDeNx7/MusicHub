import { Link } from "react-router-dom";

export default function ReleaseCard({ release }) {
  return (
    <div className="release-card">
      <img
        src={release.cover_image}
        alt={release.title}
        className="release-card-image"
      />

      <div className="release-card-content">
        <h4>{release.title} {release.year && `(${release.year})`}</h4>

        {/* Artist name from joined table */}
        {release.artists?.name && (
          <p className="release-card-artist">{release.artists.name}</p>
        )}

        <Link to={`/release/${release.id}`} className="details-button">
          View Details
        </Link>
      </div>
    </div>
  );
}
