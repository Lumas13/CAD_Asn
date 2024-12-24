import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";

const presetUsers = [
  { email: "student@nyp.edu.sg", password: "student123", role: "student", name: "224015N" },
  { email: "staff@nyp.edu.sg", password: "staff123", role: "staff", name: "Mr Yang" },
];

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    const foundUser = presetUsers.find(
      (user) => user.email === email && user.password === password
    );
  
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser)); 
      navigate("/"); 
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };  

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// Validate props
LoginPage.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginPage;
