import React from 'react'

export default function AudioPlayer({ track }) {
  console.log("Track received:", track)

  return (
    <div className="track">
      <h4>{track.title}</h4>

      <p style={{ fontSize: "12px", color: "gray" }}>
        URL: {track.audio_url || "NO URL FOUND"}
      </p>

      <audio
        controls
        src={track.audio_url}
        style={{ width: "300px", background: "white" }}
      ></audio>
    </div>
  )
}
