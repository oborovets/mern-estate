import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.id);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setError(null);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const isInputFilled = Object.values(formData).filter(Boolean).length === 2;
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={(e) => handleChange(e)}
        />
        <button
          disabled={loading || !isInputFilled}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t have an account?</p>
        <Link to="/sign-uo">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
