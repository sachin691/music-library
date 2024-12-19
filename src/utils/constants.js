// src/utils/constants.js

// Roles
const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  // USER: "user",
  // ARTIST: "artist",
  VIEWER: "viewer"
};

// Status Codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409, // Added the CONFLICT status code
  INTERNAL_SERVER_ERROR: 500,
};


const CATEGORIES = {
  ARTIST: "artist",
  ALBUM: "album",
  TRACK: "track"
}

// Common Messages
// const MESSAGES = {
//   RESOURCE_NOT_FOUND: "The requested resource could not be found.",
//   UNAUTHORIZED_ACCESS: "You are not authorized to access this resource.",
//   FORBIDDEN_ACTION: "You are forbidden from performing this action.",
//   INVALID_CREDENTIALS: "Invalid username or password.",
// };

module.exports = { ROLES, STATUS_CODES, CATEGORIES };
