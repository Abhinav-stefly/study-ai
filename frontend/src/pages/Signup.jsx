import { useState } from "react";
import { signupUser } from "../api/auth.api";

export default function Signup() {
  const [form, setForm] = useState({});

  const submit = async e => {
    e.preventDefault();
    await signupUser(form);
    alert("Registered successfully");
  };

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button>Register</button>
    </form>
  );
}
