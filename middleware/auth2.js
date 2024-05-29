const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ErrorHandler } = require("../helper");
const isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
  
     if (!token) {
       return next(new ErrorHandler( 401,"Login first to access this resource"));
     }
  
     const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
     req.user = await User.findById(decoded.id);
    next();
  };
   const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            403,`Role (${req.user.role}) is not allowed to access this resource`
          )
        );
      }
  
      next();
    };
  };
  module.exports={isAuthenticatedUser,authorizeRoles}