import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Navbar() {
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <nav style={{ background: "#000", padding: "1rem", textAlign: "center" }}>
      <Link to="/" style={{ margin: "0 1rem", color: "#fff" }}>Home</Link>
      <Link to="/artists" style={{ margin: "0 1rem", color: "#fff" }}>Artists</Link>
      <Link to="/releases" style={{ margin: "0 1rem", color: "#fff" }}>Releases</Link>
      <Link to="/contact" style={{ margin: "0 1rem", color: "#fff" }}>Contact</Link>
      {session ? (
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
      ) : (
        <Link to="/auth" style={{ marginLeft: "1rem", color: "#fff" }}>Login/Signup</Link>
      )}
    </nav>
  );
}

