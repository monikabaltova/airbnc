const req = require("express/lib/request");
const {
  fetchPropertyReviews,
  insertPropertyReview,
} = require("../models/reviews.model");
const res = require("express/lib/response");

exports.getPropertyReviews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [reviews, average_rating] = await fetchPropertyReviews(id);
    res.status(200).send({ reviews, average_rating });
  } catch (error) {
    next(error);
  }
};

exports.postPropertyReview = async (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id } = req.params;

  try {
    const review = await insertPropertyReview(id, guest_id, rating, comment);
    res.status(201).send({ review });
  } catch (error) {
    next(error);
  }
};
