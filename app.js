const express = require("express");
const {
  getAllProperties,
  getPropertiesById,
} = require("./controllers/properties.controllers");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertiesById);

module.exports = app;
