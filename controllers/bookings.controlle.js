const req = require("express/lib/request");
const { fetchBookings, insertBooking } = require("../models/bookings.model");
const res = require("express/lib/response");

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

exports.postBooking = async (req, res, next) => {
  const { id: property_id } = req.params;
  const { guest_id, check_in_date, check_out_date } = req.body;
  try {
    const booking_id = await insertBooking(
      property_id,
      guest_id,
      check_in_date,
      check_out_date
    );
    res.status(201).send({ msg: "Booking successful", booking_id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
