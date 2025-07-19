function arrayPropertyData(data) {
  const formatData = data.map(({ property_type, description }) => [
    property_type,
    description,
  ]);
  return formatData;
}

function arrayUserData(data) {
  const formatData = data.map(
    ({
      user_id,
      first_name,
      surname,
      email,
      phone_number,
      is_host,
      avatar,
      created_at,
    }) => [
      user_id,
      first_name,
      surname,
      email,
      phone_number,
      is_host,
      avatar,
      created_at,
    ]
  );
  return formatData;
}

module.exports = { arrayPropertyData, arrayUserData };
