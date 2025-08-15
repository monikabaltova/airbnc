const express = require("express");
const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomError,
  handleServerError,
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
const {
  postFavourite,
  deleteFavourites,
} = require("./controllers/favourites.controller");
const {
  getBookings,
  postBooking,
  deleteBooking,
} = require("./controllers/bookings.controlle");

const { getUserById } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertiesById);
app.get("/api/users/:id", getUserById);
app.get("/api/properties/:id/reviews", getPropertyReviews);
app.get("/api/properties/:id/bookings", getBookings);

app.post("/api/properties/:id/reviews", postPropertyReview);
app.post("/api/properties/:id/favourite", postFavourite);
app.post("/api/properties/:id/booking", postBooking);

app.delete("/api/reviews/:id", deletePropertyReviews);
app.delete(
  "/api/properties/:property_id/users/:guest_id/favourite",
  deleteFavourites
);
app.delete("/api/bookings/:id", deleteBooking);

app.all("/*invalid", handlePathNotFound);

app.use(handleCustomError);
app.use(handleBadRequest);
app.use(handleServerError);

module.exports = app;
