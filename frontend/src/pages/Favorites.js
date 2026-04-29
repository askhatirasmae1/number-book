import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useToast } from "../services/useToast";
import "../style.css";

const COLORS = ["blue", "green", "orange", "purple"];

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get("/favorites");
      setFavorites(res.data);
    } catch {
      showToast("Erreur de chargement", "error");
    }
    setLoading(false);
  };

  const removeFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      showToast("Favori supprimé");
      loadFavorites();
    } catch {
      showToast("Erreur", "error");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar title="Suivi des favoris" />

        <div className="page-body">

          <div className="section-header">
            <p className="text-muted">
              {favorites.length} contact{favorites.length !== 1 ? "s" : ""} en favori
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" /> Chargement...
            </div>
          ) : favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">♡</div>
              <h4>Aucun favori</h4>
              <p>Aucun contact pour le moment.</p>
            </div>
          ) : (
            <div className="fav-grid">
              {favorites.map((c, i) => (
                <div className="fav-card" key={c.id}>

                  <div className="fav-card-header">
                    <div className={`avatar avatar-${COLORS[i % COLORS.length]}`}>
                      {c.nom?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="fav-card-name">{c.nom}</div>
                      <div className="text-muted mt-4">{c.telephone}</div>
                    </div>
                  </div>

                  {c.email && (
                    <p className="text-muted mt-4">
                      ✉ {c.email}
                    </p>
                  )}

                  <div className="fav-card-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFavorite(c.id)}
                    >
                      Retirer
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {ToastComponent}
    </div>
  );
}

export default Favorites;