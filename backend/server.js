const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Routes */
app.use("/auth", require("./routes/auth"));
app.use("/contacts", require("./routes/contacts"));
app.use("/groups", require("./routes/groups"));
app.use("/users", require("./routes/users"));
app.use("/favorites", require("./routes/favorites"));

/* Test */
app.get("/", (req, res) => {
  res.send("API Number Book fonctionne correctement 🚀");
});

/* =========================
   SEED ADMIN (IMPORTANT)
   ========================= */
const seedAdmin = require("./seed");
seedAdmin();

/* Start server */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});