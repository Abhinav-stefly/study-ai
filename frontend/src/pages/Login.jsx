import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser({ email, password });
      const user = { _id: res.data._id, name: res.data.name, email: res.data.email };
      const token = res.data.token;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <div className="auth-wrapper">
        <div className="auth-card">
          <form onSubmit={submit}>
            <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
            {error && <p style={{color:'#ff6b6b',marginBottom:8}}>{error}</p>}

            <label className="page-sub">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-field"
            />

            <label className="page-sub">Password</label>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-field"
            />

            <div className="auth-actions">
              <div style={{display:'flex',gap:8}}>
                <button className="btn-primary" type="submit">Login</button>
                <Link to="/signup" className="btn-ghost" style={{alignSelf:'center'}}>Create account</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
