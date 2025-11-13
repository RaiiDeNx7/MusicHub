import React from 'react'

export default function AudioPlayer({ track }) {
  return (
    <div className="track">
      <h4>{track.title}</h4>
      <audio controls src={track.audio_url}></audio>
    </div>
  )
}
