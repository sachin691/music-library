const { ROLES } = require("../utils/constants")
const isAdmin = (req, res, next) => {
  try {
    // Ensure the user is authenticated first
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // Check if the user's role is Admin
    if (req.user.role !==  ROLES.ADMIN) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = isAdmin;
