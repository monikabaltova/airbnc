const { fetchBookings } = require("../models/bookings.model");

exports.getBookings = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bookings = await fetchBookings(id);
    const property_id = Number(id);
    res.status(200).send({ bookings, property_id });
  } catch (error) {
    next(error);
  }
};
