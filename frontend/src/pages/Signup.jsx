import { useState, useContext, useEffect } from "react";
import { signupUser } from "../api/auth.api";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <div className="auth-wrapper">
        <div className="auth-card">
          <form onSubmit={submit}>
            <h2 className="text-xl font-semibold mb-4">Create account</h2>
            {error && <p style={{color:'#ff6b6b',marginBottom:8}}>{error}</p>}

            <input placeholder="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })} className="auth-field" />
            <input placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} className="auth-field" />
            <input type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} className="auth-field" />

            <div className="auth-actions">
              <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
