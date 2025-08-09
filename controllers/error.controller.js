exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleDataNotFound = (err, req, res, next) => {
  res.status(404).send({ msg: "Data not found." });
};

exports.handleBadRequest = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request." });
  } else {
    next(err);
  }
};
