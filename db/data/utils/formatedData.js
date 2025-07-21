function formattedData(data) {
  const formatData = data.map((obj) => Object.values(obj));
  return formatData;
}

function replaceHostNameWithUserId(propertiesData, usersData) {
  const userRef = {};
  usersData.forEach((user, index) => {
    const fullName = `${user.first_name} ${user.surname}`;
    userRef[fullName] = index + 1;
  });

  return propertiesData.map((property) => {
    const hostId = userRef[property.host_name];

    const newProperty = { ...property };
    newProperty.host_id = hostId;
    delete newProperty.host_name;
    return newProperty;
  });
}

function sortPropertyKeys(propertiesArray) {
  const correctOrder = [
    "host_id",
    "name",
    "location",
    "property_type",
    "price_per_night",
    "description",
  ];

  return propertiesArray.map((property) =>
    correctOrder.map((key) => property[key])
  );
}

module.exports = { formattedData, replaceHostNameWithUserId, sortPropertyKeys };
