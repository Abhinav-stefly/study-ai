import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Study AI</h1>
      <div className="space-x-4">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn">Signup</Link>
        <Link to="/dashboard" className="btn">Dashboard</Link>
      </div>
    </div>
  );
}
