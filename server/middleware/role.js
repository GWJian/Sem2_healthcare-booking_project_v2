//this file is used to define the roles and permissions for the users
//admin can create and delete appointments
//doctor can read any profile
//customer can read and update own profile
//this file is used to check if the user has permission to access the route

const isAdmin = () => {
  return (req, res, next) => {
    if (req.user.role === "admin") {
      return next();
    } else {
      return res.status(401).json({
        message: "You are not admin to access this route",
      });
    }
  };
};

const isDoctor = () => {
  return (req, res, next) => {
    if (req.user.role === "doctor") {
      return next();
    } else {
      return res.status(401).json({
        message: "You are not doctor to access this route",
      });
    }
  };
};

//doctor and admin can access this route
const isDoctorOrAdmin = () => {
  return (req, res, next) => {
    if (req.user.role === "doctor" || req.user.role === "admin") {
      return next();
    } else {
      return res.status(401).json({
        message: "You are not allow to access this route",
      });
    }
  };
};

// const isCustomer = () => {
//   return (req, res, next) => {
//     if (req.user.role === "customer") {
//       return next();
//     } else {
//       return res.status(401).json({
//         message: "Please login or signup",
//       });
//     }
//   };
// };

module.exports = { isAdmin, isDoctor, isDoctorOrAdmin };
