import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function ReleaseDetail() {
  const { id } = useParams()
  const [release, setRelease] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setRelease(data)
    }

    fetchData()
  }, [id])

  if (!release) return <p>Loading...</p>

  return (
    <div className="page">
      <h2>{release.title}</h2>
      <img src={release.cover_image} alt={release.title} className="release-banner" />

      <p>{release.description}</p>

      <h3>Listen</h3>

      {release.audio_url ? (
        <audio
          controls
          src={release.audio_url}
          style={{ width: "100%", maxWidth: "400px" }}
        />
      ) : (
        <p>No audio available for this release.</p>
      )}
    </div>
  )
}
