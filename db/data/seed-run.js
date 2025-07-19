const seed = require("./seed");

const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
} = require("./test/index");

seed(propertyTypesData, usersData, propertiesData, reviewsData);
