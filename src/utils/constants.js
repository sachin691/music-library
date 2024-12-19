// Roles
const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
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
  CONFLICT: 409, 
  INTERNAL_SERVER_ERROR: 500,
};


const CATEGORIES = {
  ARTIST: "artist",
  ALBUM: "album",
  TRACK: "track"
}

module.exports = { ROLES, STATUS_CODES, CATEGORIES };
