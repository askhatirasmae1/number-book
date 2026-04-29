import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useToast } from "../services/useToast";
import "../style.css";

/* Icons groupe */
const GROUP_ICONS = {
  "Urgences": "🚨",
  "Santé": "🏥",
  "Administration": "🏛️",
  "Enseignement": "🎓",
  "Sécurité": "👮",
  "Transport": "🚌"
};

const EMPTY_FORM = { id: null, nom: "" };

function Groups() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  /* =========================
     LOAD GROUPS
     ========================= */
  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/groups");
      setGroups(res.data);
    } catch {
      showToast("Erreur de chargement", "error");
    }
    setLoading(false);
  };

  /* =========================
     OPEN / CLOSE MODAL
     ========================= */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (g) => {
    setForm(g);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm(EMPTY_FORM);
  };

  /* =========================
     ADD / UPDATE GROUP
     ========================= */
  const handleSubmit = async () => {
    if (!form.nom.trim()) {
      showToast("Le nom est requis", "error");
      return;
    }

    try {
      if (form.id) {
        await api.put(`/groups/${form.id}`, { nom: form.nom });
        showToast("Groupe modifié ✓");
      } else {
        await api.post("/groups", { nom: form.nom });
        showToast("Groupe ajouté ✓");
      }

      closeModal();
      loadGroups();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    }
  };

  /* =========================
     DELETE GROUP
     ========================= */
  const deleteGroup = async (id) => {
    if (!window.confirm("Supprimer ce groupe ?")) return;

    try {
      await api.delete(`/groups/${id}`);
      showToast("Groupe supprimé");
      loadGroups();
    } catch {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar title="Gestion des groupes" />

        <div className="page-body">

          {/* HEADER */}
          <div className="section-header">
            <p className="text-muted">
              {groups.length} groupe{groups.length !== 1 ? "s" : ""}
            </p>

            <button className="btn btn-primary" onClick={openAdd}>
              + Nouveau groupe
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="loading">
              <div className="spinner" /> Chargement...
            </div>
          ) : groups.length === 0 ? (

            /* EMPTY */
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <h4>Aucun groupe</h4>
              <p>Créez des groupes pour organiser vos contacts.</p>
            </div>

          ) : (

            /* LIST */
            <div className="groups-grid">
              {groups.map((g) => (
                <div className="group-card" key={g.id}>

                  <div className="group-info">
                    <div className="group-icon">
                      {GROUP_ICONS[g.nom] || "📁"}
                    </div>

                    <div>
                      <div className="group-name">{g.nom}</div>
                      <div className="group-count">
                        Groupe de contacts
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(g)}
                    >
                      ✎
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteGroup(g.id)}
                    >
                      ✕
                    </button>
                  </div>

                </div>
              ))}
            </div>

          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h3>
                {form.id ? "✎ Modifier le groupe" : "+ Nouveau groupe"}
              </h3>

              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Nom du groupe *</label>
              <input
                placeholder="Ex: Urgences, Santé..."
                value={form.nom}
                onChange={(e) =>
                  setForm({ ...form, nom: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>

              <button className="btn btn-primary" onClick={handleSubmit}>
                {form.id ? "Modifier" : "Ajouter"} →
              </button>
            </div>

          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
}

export default Groups;