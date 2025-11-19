// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const linksRouter = require("./src/routes/links");
const config = require("./src/config");

const app = express();

// Simple CORS for development: allow frontend origin or everything.
// For dev convenience use app.use(cors()) to allow all origins.
// If you prefer to restrict, set CLIENT_URL in .env and uncomment the origin-check block.
app.use(cors()); // <-- allow all origins in development

/*
// Safer origin check (uncomment to use):
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === CLIENT_URL) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
*/

// Allow parsing JSON body
app.use(express.json());

// Healthcheck
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// API routes
app.use("/api/links", linksRouter);

// Redirect route (/:code) - must be after /api and /healthz
app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const Link = require("./src/models/Link");
  try {
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send("Not found");

    // increment clicks and update lastClicked
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return res.redirect(302, link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Connect to DB and start
const PORT = process.env.PORT || 4000;
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
  });
