import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser({ email, password });
      // backend returns user fields at response root: {_id,name,email,token}
      const user = { _id: res.data._id, name: res.data.name, email: res.data.email };
      const token = res.data.token;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full mb-4 p-2 border rounded"
      />
      <button className="btn">Login</button>
    </form>
  );
}
