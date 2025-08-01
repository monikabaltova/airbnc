const { fetchAllProperties } = require("../models/properties.model");

exports.getAllProperties = async (req, res, next) => {
  const { sort, order, max_price, min_price, property_type } = req.query;
  try {
    const properties = await fetchAllProperties(
      sort,
      order,
      max_price,
      min_price,
      property_type
    );

    res.status(200).send(properties);
  } catch (error) {
    next(error);
  }
};
