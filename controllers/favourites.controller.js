const req = require("express/lib/request");
const {
  insertFavourite,
  removeFavourite,
} = require("../models/favourites.model");
const res = require("express/lib/response");

exports.postFavourite = async (req, res, next) => {
  const { guest_id } = req.body;
  const { id: property_id } = req.params;
  try {
    const favourite_id = await insertFavourite(guest_id, property_id);
    res
      .status(201)
      .send({ msg: "Property favourited successfully", favourite_id });
  } catch (error) {
    next(error);
  }
};

exports.deleteFavourites = async (req, res, next) => {
  const { property_id, guest_id } = req.params;
  try {
    await removeFavourite(property_id, guest_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
