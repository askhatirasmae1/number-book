import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useToast } from "../services/useToast";
import "../style.css";

const COLORS = ["blue", "green", "orange", "purple"];

const EMPTY_FORM = {
  id: null, nom: "", telephone: "", email: "", description: "", groupe_id: "",
};

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [groups,   setGroups]   = useState([]);
  const [search,   setSearch]   = useState("");
  const [filterGrp, setFilterGrp] = useState("");
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [modal,    setModal]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cRes, gRes] = await Promise.all([
        api.get("/contacts"),
        api.get("/groups"),
      ]);
      setContacts(cRes.data);
      setGroups(gRes.data);
    } catch (_) {
      showToast("Erreur de chargement", "error");
    }
    setLoading(false);
  };

  const openAdd  = () => { setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (c) => { setForm(c); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY_FORM); };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nom || !form.telephone) {
      showToast("Nom et téléphone requis", "error");
      return;
    }
    try {
      if (form.id) {
        await api.put(`/contacts/${form.id}`, form);
        showToast("Contact modifié ✓");
      } else {
        await api.post("/contacts", form);
        showToast("Contact ajouté ✓");
      }
      closeModal();
      loadAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Erreur", "error");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Supprimer ce contact ?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      showToast("Contact supprimé");
      loadAll();
    } catch (_) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const getGroupName = (id) =>
    groups.find((g) => g.id === id)?.nom || "—";

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.nom?.toLowerCase().includes(q) ||
      c.telephone?.includes(q) ||
      c.email?.toLowerCase().includes(q);
    const matchGroup = filterGrp ? c.groupe_id == filterGrp : true;
    return matchSearch && matchGroup;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des contacts" />
        <div className="page-body">

          {/* Toolbar */}
          <div className="search-bar">
            <div className="search-input-wrap" style={{ flex: 2 }}>
              <span className="search-icon"></span>
              <input
                className="search-input"
                placeholder="Rechercher par nom, téléphone, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{ width: 180 }}
              value={filterGrp}
              onChange={(e) => setFilterGrp(e.target.value)}
            >
              <option value="">Tous les groupes</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.nom}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={openAdd}>
              + Nouveau contact
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="loading"><div className="spinner" /> Chargement...</div>
          ) : (
            <div className="table-wrap">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">◎</div>
                  <h4>Aucun contact trouvé</h4>
                  <p>Ajoutez un contact ou modifiez votre recherche.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Contact</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Groupe</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr key={c.id}>
                        <td>
                          <div className="contact-row">
                            <div className={`avatar avatar-${COLORS[i % COLORS.length]}`}>
                              {c.nom?.charAt(0).toUpperCase()}
                            </div>
                            {c.nom}
                          </div>
                        </td>
                        <td>{c.telephone}</td>
                        <td className="text-muted">{c.email || "—"}</td>
                        <td>
                          {c.groupe_id ? (
                            <span className="badge badge-blue">{getGroupName(c.groupe_id)}</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>
                              ✎ Modifier
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteContact(c.id)}>
                              ✕ Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Count */}
          <p className="text-muted mt-8">
            {filtered.length} contact{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{form.id ? "✎ Modifier le contact" : "+ Nouveau contact"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nom *</label>
                <input name="nom" placeholder="Ex: Urgences CHU" value={form.nom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input name="telephone" placeholder="0612345678" value={form.telephone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="contact@example.com" value={form.email || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={3} placeholder="Description du contact…" value={form.description || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Groupe</label>
              <select name="groupe_id" value={form.groupe_id || ""} onChange={handleChange}>
                <option value="">Aucun groupe</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.nom}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {form.id ? "Enregistrer" : "Ajouter"} →
              </button>
            </div>
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
}

export default Contacts;