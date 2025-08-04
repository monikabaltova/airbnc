const express = require("express");
const {
  handleBadRequest,
  handlePathNotFound,
  handleCustomError,
} = require("./controllers/error.controller");
const {
  getAllProperties,
  getPropertiesById,
} = require("./controllers/properties.controller");

const { getUserById } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertiesById);
app.get("/api/users/:id", getUserById);

app.all("/*invalid", handlePathNotFound);

app.use(handleBadRequest);
app.use(handleCustomError);

module.exports = app;
