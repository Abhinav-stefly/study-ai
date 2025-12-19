import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header page-container">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <Link to="/dashboard" style={{fontWeight:800,fontSize:18}}>DocAI</Link>
        <div className="page-sub">Study smarter — chat and make flashcards</div>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <span style={{marginRight:8}}>Hi, {user.name || user.email}</span>
            <button className="btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="btn-ghost" onClick={() => navigate('/study')}>Study</button>
            <button className="btn-primary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
