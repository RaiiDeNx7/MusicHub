import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase/client'
import AudioPlayer from '../components/AudioPlayer'

export default function ReleaseDetail() {
  const { id } = useParams()
  const [release, setRelease] = useState(null)
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: releaseData } = await supabase.from('releases').select('*').eq('id', id).single()
      const { data: trackData } = await supabase.from('tracks').select('*').eq('release_id', id).order('track_order')
      setRelease(releaseData)
      setTracks(trackData)
    }
    fetchData()
  }, [id])

  if (!release) return <p>Loading...</p>

  return (
    <div className="page">
      <h2>{release.title}</h2>
      <img src={release.cover_image} alt={release.title} className="release-banner" />
      <p>{release.description}</p>

      <h3>Tracklist</h3>
      {tracks.map((track) => (
        <AudioPlayer key={track.id} track={track} />
      ))}
    </div>
  )
}
