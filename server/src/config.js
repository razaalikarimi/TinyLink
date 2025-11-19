// src/config.js
module.exports = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/tinylink",
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",
};
