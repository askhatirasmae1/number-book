import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../style.css";

const COLORS = ["blue", "green", "orange", "red"];
const GROUP_ICONS = ["🏥", "🚨", "🎓", "🏛️", "📞", "🔧", "🌐"];

function Dashboard() {
  const [stats, setStats]   = useState({ contacts: 0, groups: 0, favorites: 0, users: 0 });
  const [groups, setGroups] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, gRes, fRes] = await Promise.all([
          api.get("/contacts"),
          api.get("/groups"),
          api.get("/favorites"),
        ]);
        setStats({
          contacts:  cRes.data.length,
          groups:    gRes.data.length,
          favorites: fRes.data.length,
          users:     0,
        });
        setGroups(gRes.data.slice(0, 4));
        setRecent(cRes.data.slice(-5).reverse());
      } catch (_) {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Contacts",  value: stats.contacts,  icon: "◎", color: "blue",   trend: "up", trendText: "Annuaire" },
    { label: "Groupes",   value: stats.groups,    icon: "⬡", color: "green",  trend: "up", trendText: "Catégories" },
    { label: "Favoris",   value: stats.favorites, icon: "♡", color: "orange", trend: "neutral", trendText: "Enregistrés" },
    { label: "Actif",     value: "Online",        icon: "◉", color: "red",    trend: "up", trendText: "API connectée" },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div className="page-body">

          {loading ? (
            <div className="loading"><div className="spinner" /> Chargement...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid">
                {statCards.map((s, i) => (
                  <div key={i} className={`stat-card ${s.color}`}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-num">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className={`stat-trend ${s.trend}`}>
                      {s.trend === "up" ? "↑" : "–"} {s.trendText}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* Recent contacts */}
                <div>
                  <div className="section-header">
                    <h3>Contacts récents</h3>
                    <a href="/contacts" style={{ fontSize: 13, color: "var(--accent-2)", textDecoration: "none" }}>
                      Voir tout →
                    </a>
                  </div>
                  <div className="table-wrap">
                    {recent.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">◎</div>
                        <p>Aucun contact</p>
                      </div>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Téléphone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recent.map((c, i) => (
                            <tr key={c.id}>
                              <td>
                                <div className="contact-row">
                                  <div className={`avatar avatar-${COLORS[i % COLORS.length]}`}>
                                    {c.nom?.charAt(0).toUpperCase()}
                                  </div>
                                  {c.nom}
                                </div>
                              </td>
                              <td className="text-muted">{c.telephone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Groups overview */}
                <div>
                  <div className="section-header">
                    <h3>Groupes actifs</h3>
                    <a href="/groups" style={{ fontSize: 13, color: "var(--accent-2)", textDecoration: "none" }}>
                      Gérer →
                    </a>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {groups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">⬡</div>
                        <p>Aucun groupe</p>
                      </div>
                    ) : (
                      groups.map((g, i) => (
                        <div className="group-card" key={g.id}>
                          <div className="group-info">
                            <div className="group-icon">{GROUP_ICONS[i % GROUP_ICONS.length]}</div>
                            <div>
                              <div className="group-name">{g.nom}</div>
                              <div className="group-count">Groupe #{g.id}</div>
                            </div>
                          </div>
                          <span className="badge badge-blue">Actif</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;