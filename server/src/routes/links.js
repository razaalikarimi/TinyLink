// src/routes/links.js
const express = require("express");
const validUrl = require("valid-url");
const Link = require("../models/Link");
const generateRandomCode = require("../utils/generateCode");

const router = express.Router();

// Validation regex for codes
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// POST /api/links Create link (409 if code exists)
router.post("/", async (req, res) => {
  try {
    let { url, code } = req.body;
    if (!url) return res.status(400).json({ error: "url is required" });

    // Validate URL
    if (!validUrl.isWebUri(url))
      return res.status(400).json({ error: "invalid url" });

    // If user passed code, validate it
    if (code) {
      if (!CODE_REGEX.test(code)) {
        return res
          .status(400)
          .json({ error: "code must match [A-Za-z0-9]{6,8}" });
      }
      const exists = await Link.findOne({ code });
      if (exists) return res.status(409).json({ error: "code already exists" });
    } else {
      // generate one and ensure uniqueness
      let tries = 0;
      do {
        code = generateRandomCode(6);
        const existing = await Link.findOne({ code });
        if (!existing) break;
        tries++;
      } while (tries < 5);
      // if collision after few tries, extend length
      if (!code)
        return res
          .status(500)
          .json({ error: "could not generate unique code" });
    }

    const link = new Link({ url, code });
    await link.save();
    return res.status(201).json({
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
      shortUrl: `${process.env.BASE_URL || req.get("host")}/${link.code}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// GET /api/links List all links
router.get("/", async (req, res) => {
  try {
    const links = await Link.find({}).sort({ createdAt: -1 }).lean();
    return res.json(links);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// GET /api/links/:code Stats for one code
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: "not found" });
    return res.json(link);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/links/:code Delete link
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const removed = await Link.findOneAndDelete({ code });
    if (!removed) return res.status(404).json({ error: "not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
