const { fetchPropertyReviews } = require("../models/reviews.model");

exports.getPropertyReviews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [reviews, average_rating] = await fetchPropertyReviews(id);
    res.status(200).send({ reviews, average_rating });
  } catch (error) {
    next(error);
  }
};
