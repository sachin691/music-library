// src/models/index.js
// const { Sequelize } = require("sequelize");
const sequelize = require("../config/index"); // Ensure this exports a Sequelize instance

// Import models
const User = require("./User");
const Organization = require("./Organization");
const Artist = require("./Artist");
const Favorite = require("./Favorite");
const Playlist = require("./Playlist");
const UserFollow = require("./UserFollow");
const Track = require("./Track");
const PlaylistTrack = require("./PlaylistTrack"); // Import PlaylistTrack model

// Initialize models
User.init({}, {sequelize});
Organization.init(sequelize);
Artist.init(sequelize);
Favorite.init(sequelize);
Playlist.init(sequelize);
UserFollow.init(sequelize);
Track.init(sequelize);
PlaylistTrack.init(sequelize); // Initialize PlaylistTrack model

// Set up associations after initializing models
User.associate({ Organization, Playlist, Favorite, Artist, UserFollow });
Organization.associate({ User, Artist });
Artist.associate({ User, UserFollow });
Favorite.associate({ User });
Playlist.associate({ User });
UserFollow.associate({ User, Artist });
Track.associate({ Artist, Album, Organization, Playlist });
PlaylistTrack.associate({ Track, Playlist }); // Add this line to associate PlaylistTrack

// Sync models with database
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false }); // { force: false } to prevent dropping tables
    console.log("Database synchronized!");
  } catch (err) {
    console.error("Error synchronizing the database:", err);
  }
};

// Run the sync
syncModels();

// Export models
module.exports = {
  User,
  Organization,
  Artist,
  Favorite,
  Playlist,
  UserFollow,
  Track,
  PlaylistTrack, // Export PlaylistTrack model
};
