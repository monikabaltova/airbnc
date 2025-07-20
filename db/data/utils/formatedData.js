function objectToArrayData(data) {
  const formatData = data.map((obj) => Object.values(obj));
  return formatData;
}

module.exports = objectToArrayData;
