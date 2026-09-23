const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 
    ? res.statusCode 
    : (err.statusCode || 500);

  res.status(statusCode);

  switch (statusCode) {
    case constants?.VALIDATION_ERROR || 400:
      res.json({ title: "Validation Failed", message: err.message, stackTrace: err.stack });
      break;
    case constants?.UNAUTHORIZED || 401:
      res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
      break;
    case constants?.FORBIDDEN || 403:
      res.json({ title: "Forbidden", message: err.message, stackTrace: err.stack });
      break;
    case constants?.NOT_FOUND || 404:
      res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
      break;
    case constants?.SERVER_ERROR || 500:
    default:
      res.json({ title: "Server Error", message: err.message, stackTrace: err.stack });
      break;
  }
};

module.exports = errorHandler;