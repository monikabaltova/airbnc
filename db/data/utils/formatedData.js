function formattedData(data) {
  const formatData = data.map((obj) => Object.values(obj));
  return formatData;
}

function createUserRef(usersData) {
  const userRef = {};
  usersData.forEach((user) => {
    userRef[`${[user.first_name]} ${user.surname}`] = user.user_id;
  });

  return userRef;
}

function createPropertyRef(propertiesData) {
  const propertyRef = {};
  propertiesData.forEach((property) => {
    propertyRef[property.name] = property.property_id;
  });
  return propertyRef;
}

function sortPropertiesKeys(propertiesData) {
  const correctOrder = [
    "host_id",
    "name",
    "location",
    "property_type",
    "price_per_night",
    "description",
  ];

  return propertiesData.map((property) =>
    correctOrder.map((key) => property[key])
  );
}

function sortReviewsKeys(reviewsData) {
  const correctOrder = [
    "property_id",
    "guest_id",
    "rating",
    "comment",
    "created_at",
  ];

  return reviewsData.map((review) => correctOrder.map((key) => review[key]));
}

module.exports = {
  formattedData,
  createUserRef,
  createPropertyRef,
  sortPropertiesKeys,
  sortReviewsKeys,
};
