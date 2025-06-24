// const CustomError = require("../../Helpers/error/CustomError")

// const customErrorHandler = (err,req,res,next)=> {
   
//     if (err.code == 11000) {
//         err = new CustomError("Duplicate Field Value Enter " , 404)
//     }

//     if (err.name === 'SyntaxError') {

//         err = new CustomError('Unexpected Sytax ', 400)
//     }
//     if (err.name === 'ValidationError') {

//         err = new CustomError(err.message, 400)
//     }

//     if (err.name === "CastError") {

//         err = new CustomError("Please provide a valid id  ", 400)
//     }
//     if (err.name === "TokenExpiredError") {

//         err = new CustomError("Jwt expired  ", 401)
//     }
//     if (err.name === "JsonWebTokenError") {
//         err = new CustomError("Jwt malformed  ", 401)

//     }

//     console.log("Custom Error Handler => ", err.name, err.message, err.statusCode)
  
//     return res.status(err.statusCode||500)
//     .json({
//         success: false  ,
//         error : err.message || "Server Error"
//     })

// }

// module.exports = customErrorHandler



const CustomError = require("../../Helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    err = new CustomError("Duplicate field value entered", 400);
  }

  // Handle JSON parse error
  if (err.name === "SyntaxError") {
    err = new CustomError("Unexpected Syntax", 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    err = new CustomError(err.message, 400);
  }

  // Mongoose invalid ObjectId (cast error)
  if (err.name === "CastError") {
    err = new CustomError("Invalid ID format", 400);
  }

  // JWT expiration error
  if (err.name === "TokenExpiredError") {
    err = new CustomError("JWT expired", 401);
  }

  // JWT invalid/malformed error
  if (err.name === "JsonWebTokenError") {
    err = new CustomError("Invalid JWT token", 401);
  }

  // Log the error for debugging
  console.error("Custom Error Handler =>", err.name, err.message, err.statusCode);

  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

module.exports = customErrorHandler;
