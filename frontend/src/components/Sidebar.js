import { NavLink } from "react-router-dom";
import "../style.css";

const navItems = [
  { to: "/dashboard", icon: "◈", label: "Dashboard" },
  { to: "/contacts",  icon: "◎", label: "Contacts" },
  { to: "/groups",    icon: "⬡", label: "Groupes" },
  { to: "/favorites", icon: "♡", label: "Favoris" },
];

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📒</div>
        <div>
          <h2>Number Book</h2>
          <span>Annuaire intelligent</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">👤</div>
          <div className="sidebar-user-info">
            <p>{user.nom || "Admin"}</p>
            <span>{user.role || "admin"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;