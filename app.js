const express = require("express");
const {
  handleBadRequest,
  handlePathNotFound,
  handleCustomError,
  handleDataNotFound,
} = require("./controllers/error.controller");
const {
  getAllProperties,
  getPropertiesById,
} = require("./controllers/properties.controller");
const {
  getPropertyReviews,
  postPropertyReview,
  deletePropertyReviews,
} = require("./controllers/reviews.controller");

const { getUserById } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertiesById);
app.get("/api/users/:id", getUserById);
app.get("/api/properties/:id/reviews", getPropertyReviews);

app.post("/api/properties/:id/reviews", postPropertyReview);

app.delete("/api/reviews/:id", deletePropertyReviews);

app.all("/*invalid", handlePathNotFound);

app.use(handleCustomError);
app.use(handleBadRequest);

module.exports = app;
