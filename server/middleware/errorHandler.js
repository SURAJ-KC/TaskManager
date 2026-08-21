const {constants} = require("../constants")
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 
    ? res.statusCode 
    : (err.statusCode || 500);
  res.status(statusCode);
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
        res.json({title: "Validation Failed",message: err.message, stackTrace: err.stack});
        break;
    case constants.NOT_FOUND:
        res.json({title: "Not Found",message: err.message, stackTrace: err.stack});
        break;
    case constants.UNAUTHORIZED:
        res.json({title: "Unauthorized",message: err.message, stackTrace: err.stack});
        break;
    case constants.FORBIDDEN:
        res.json({title: "Forbidden",message: err.message, stackTrace: err.stack});
        break;
    case constants.SERVER_ERROR:
    default  :
        res.json({ title: "Server Error", ...responsePayload });
        break;
  }
  
  
}
module.exports = errorHandler;