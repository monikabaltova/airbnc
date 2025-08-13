exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handleBadRequest = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request: invalid data" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Fill up all required fields" });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
