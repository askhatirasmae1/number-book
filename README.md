 # 📒 Number Book — Annuaire Intelligent

Number Book est une application mobile et web permettant de centraliser des contacts utiles dans plusieurs catégories comme les urgences, la santé, l’administration, l’enseignement, la sécurité et le transport.

Le projet est composé de trois parties principales :

- une application mobile Android destinée aux utilisateurs ;
- une interface web React destinée à l’administration ;
- une API backend Node.js / Express connectée à une base de données MySQL.

L’objectif principal est de permettre à l’utilisateur de consulter rapidement les contacts importants, de rechercher un contact, de filtrer par groupe, d’appeler directement, de copier un numéro, d’envoyer un email et de gérer une liste de favoris.

## 👥 Acteurs du système

Le système distingue deux types d’acteurs principaux :

### 👤 Utilisateur (Mobile)

L’utilisateur utilise l’application mobile pour :

- Consulter la liste des contacts
- Rechercher un contact par nom ou numéro
- Filtrer les contacts par groupe
- Voir les détails d’un contact
- Appeler directement un contact
- Copier le numéro de téléphone
- Envoyer un email si disponible
- Ajouter un contact aux favoris
- Retirer un contact des favoris
- Consulter la liste des favoris

---

### 🔧 Administrateur (Web)

L’administrateur utilise l’interface web pour :

- Se connecter au système
- Consulter le tableau de bord (dashboard)
- Ajouter des contacts
- Modifier des contacts
- Supprimer des contacts
- Gérer les groupes (catégories)
- Associer chaque contact à un groupe
- Visualiser les contacts récents


## 🧱 Architecture générale

Le projet **Number Book** repose sur une architecture en trois couches :

- **Frontend Web (React)** pour l’administration
- **Application Mobile (Android)** pour les utilisateurs
- **Backend API (Node.js / Express)** pour la logique métier et l’accès aux données

---

### 🔄 Communication

Les deux interfaces (Web et Mobile) communiquent avec le backend via une API REST en utilisant le format JSON.

```text
Mobile Android  ───────►
                       │
                       │   API REST (Node.js / Express)
                       │
Web React      ───────►
                       │
                       ▼
                 Base de données MySQL
```
## 🗄️ Structure de la base de données

La base de données du projet **Number Book** est une base MySQL nommée `number_book`.  
Elle respecte la contrainte du cahier de charge : **maximum 4 tables principales**.

Les tables utilisées sont :

- `utilisateurs`
- `contacts`
- `groupes_contacts`
- `favoris`

---

### 👤 Table `utilisateurs`

Cette table stocke les comptes des utilisateurs et de l’administrateur.

```sql
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user'
);
```
Table groupes_contacts

Cette table contient les catégories des contacts, par exemple : Urgences, Santé, Administration, Enseignement, Sécurité et Transport.

```sql
CREATE TABLE groupes_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE
);
```
📞 Table contacts

Cette table contient les informations des contacts.
Chaque contact peut appartenir à un seul groupe.

```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  telephone VARCHAR(30) NOT NULL,
  email VARCHAR(150),
  description TEXT,
  groupe_id INT,
  FOREIGN KEY (groupe_id) REFERENCES groupes_contacts(id)
);
```
⭐ Table favoris

Cette table permet à chaque utilisateur d’ajouter plusieurs contacts à sa liste de favoris.
```sql
CREATE TABLE favoris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  contact_id INT NOT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favori (utilisateur_id, contact_id)
);
```
🔎 Requêtes SQL principales utilisées

Récupération des contacts avec le nom du groupe

```sql
SELECT c.*, g.nom AS groupe_nom
FROM contacts c
LEFT JOIN groupes_contacts g ON c.groupe_id = g.id;
```

Recherche d’un contact
```sql
SELECT c.*, g.nom AS groupe_nom
FROM contacts c
LEFT JOIN groupes_contacts g ON c.groupe_id = g.id
WHERE c.nom LIKE '%mot%'
   OR c.telephone LIKE '%mot%'
   OR c.email LIKE '%mot%'
   OR c.description LIKE '%mot%';
```

Filtrage des contacts par groupe
```sql
SELECT c.*, g.nom AS groupe_nom
FROM contacts c
LEFT JOIN groupes_contacts g ON c.groupe_id = g.id
WHERE c.groupe_id = 1;
```

Ajout d’un contact

```sql
INSERT INTO contacts (nom, telephone, email, description, groupe_id)
VALUES ('Nom du contact', 'Téléphone', 'Email', 'Description', 1);
```

Modification d’un contact

```sql
UPDATE contacts
SET nom = 'Nouveau nom',
    telephone = 'Nouveau téléphone',
    email = 'Nouvel email',
    description = 'Nouvelle description',
    groupe_id = 1
WHERE id = 1;
```

Suppression d’un contact

```sql
DELETE FROM contacts
WHERE id = 1;
```

Récupération des groupes

```sql
SELECT *
FROM groupes_contacts
ORDER BY nom ASC;
```

Ajout d’un favori

```sql
INSERT INTO favoris (utilisateur_id, contact_id)
VALUES (1, 5);
```

Récupération des favoris avec le nom du groupe

```sql
SELECT c.*, g.nom AS groupe_nom
FROM contacts c
JOIN favoris f ON c.id = f.contact_id
LEFT JOIN groupes_contacts g ON c.groupe_id = g.id
WHERE f.utilisateur_id = 1;
```
Retrait d’un favori

```sql
DELETE FROM favoris
WHERE utilisateur_id = 1 AND contact_id = 5;
```

📱l'application Mobile

L'application mobile propose une interface simple, moderne et intuitive permettant un accès rapide aux contacts utiles.

Fonctionnalités principales

🔍 Recherche en temps réel par nom ou numéro

🏷️ Filtrage des contacts par groupe (Santé, Administration, Enseignants...)

⭐ Ajout et suppression des favoris

📞 Appel direct depuis l'application

📋 Copier le numéro

📧 Envoi d’email (si disponible)

Objectif
Faciliter l'accès rapide aux contacts importants avec une navigation simple et fluide.

🖥️l'interface Web

L’interface web est destinée à l’administration du système.

Fonctionnalités
📊 Tableau de bord avec statistiques
📋 Gestion des contacts (Ajouter / Modifier / Supprimer)
🏷️ Gestion des groupes
🔍 Recherche et filtrage

Objectif
Permettre à l’administrateur de gérer facilement les données de l’application.

🚀 Installation et démarrage
Backend
```
cd backend
npm install
node server.js
```
Frontend (Web)
```
cd frontend
npm install
npm start
```

🛠️ Technologies utilisées
Android (Java, RecyclerView, Retrofit)
Node.js (Express)
MySQL
React.js
JWT (authentification)


🎯 Conclusion

Ce projet propose une solution complète pour la gestion des contacts utiles d’un établissement à travers une application mobile et une interface web d’administration.
Il permet une consultation rapide, une organisation par groupes et une gestion efficace des favoris.

# DEMO VEDIO

   🖥️l'interface Web
   
https://github.com/user-attachments/assets/303d7e8f-3061-4975-886f-d3988e317ec0

   📱l'application Mobile
   
https://github.com/user-attachments/assets/f0434e9d-ff3f-42eb-a7da-63b33ea6fe0f




   


