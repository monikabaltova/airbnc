const {
  fetchAllProperties,
  fetchPropertiesById,
} = require("../models/properties.model");

exports.getAllProperties = async (req, res, next) => {
  const { sort, order, max_price, min_price, property_type, host_id } =
    req.query;
  try {
    const properties = await fetchAllProperties(
      sort,
      order,
      max_price,
      min_price,
      property_type,
      host_id
    );

    res.status(200).send(properties);
  } catch (error) {
    next(error);
  }
};

exports.getPropertiesById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    const property = await fetchPropertiesById(id, user_id);
    res.status(200).send(property);
  } catch (error) {
    next(error);
  }
};
