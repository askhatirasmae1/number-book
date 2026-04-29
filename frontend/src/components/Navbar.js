import { useNavigate } from "react-router-dom";
import "../style.css";

function Navbar({ title }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        <div className="topbar-badge" title="Connecté"></div>
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          ⎋ Déconnexion
        </button>
      </div>
    </div>
  );
}

export default Navbar;