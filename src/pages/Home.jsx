import React from 'react'
import HeroSection from '../components/HeroSection'
import Releases from './Releases'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Latest Releases</h2>
      <Releases limit={4} />
    </div>
  )
}
