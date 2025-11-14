import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Artists from './pages/Artists'
import ArtistProfile from './pages/ArtistProfile'
import Releases from './pages/Releases'
import ReleaseDetail from './pages/ReleaseDetail'
import Contact from './pages/Contact'
import AddArtist from './pages/AddArtist'
import AddRelease from './pages/AddRelease'
import EditArtist from "./pages/EditArtist";
import EditRelease from "./pages/EditRelease";


export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/release/:id" element={<ReleaseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-artist" element={<AddArtist />} />
          <Route path="/add-release" element={<AddRelease />} />
          <Route path="/artist/edit/:id" element={<EditArtist />} />
          <Route path="/release/edit/:id" element={<EditRelease />} />

        </Routes>
      </main>
      <Footer />
    </>
  );
}


