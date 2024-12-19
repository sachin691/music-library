// // src/models/index.js

// const sequelize = require("../config/index");
// const Organization = require("./Organization");
// const User = require("./User");
// const Artist = require("./Artist");
// const Album = require("./Album");
// const Track = require("./Track");
// const Favorite = require("./Favorite");
// const Playlist = require("./Playlist");
// const UserFollow = require("./UserFollow");
// const RecentlyPlayed = require("./RecentlyPlayed");
// const PlaylistTrack = require("./PlaylistTrack");

// const syncModels = async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("Database synchronized!");
//   } catch (err) {
//     console.error("Error synchronizing the database:", err);
//   }
// };

// // Run the sync
// syncModels();

// module.exports = {
//   User,
//   Organization,
//   Artist,
//   Album,
//   Track,
//   Favorite,
//   Playlist,
//   UserFollow,
//   RecentlyPlayed,
//   PlaylistTrack,
// };


// src/models/index.js

// src/models/index.js

const sequelize = require("../config/index"); // Sequelize instance
const Organization = require("./Organization");
const User = require("./User");
const Artist = require("./Artist");
const Album = require("./Album");
const Track = require("./Track");
const Favorite = require("./Favorite");
const Playlist = require("./Playlist");
const UserFollow = require("./UserFollow");
const RecentlyPlayed = require("./RecentlyPlayed");
const PlaylistTrack = require("./PlaylistTrack");

// Initialize all models with sequelize instance
Organization.init(sequelize);
User.init(sequelize);
Artist.init(sequelize);
Album.init(sequelize);
Track.init(sequelize);
Favorite.init(sequelize);
Playlist.init(sequelize);
UserFollow.init(sequelize);
RecentlyPlayed.init(sequelize);
PlaylistTrack.init(sequelize);

// Set up associations after all models are initialized
// Album associations
Album.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
  onDelete: "CASCADE", // Ensuring the album is deleted when artist is deleted
});
Album.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
  onDelete: "CASCADE", // Ensuring the album is deleted when organization is deleted
});

// Favorite associations
Favorite.belongsTo(Artist, {
  foreignKey: "item_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "artist",
});
Favorite.belongsTo(Album, {
  foreignKey: "item_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "album",
});
Favorite.belongsTo(Track, {
  foreignKey: "item_id",
  constraints: false, // Disable constraints for polymorphic relationship
  as: "track",
});

// Organization associations
Organization.hasMany(User, {
  foreignKey: "organization_id", // Linking the organization_id field in User model
  as: "users", // Alias for the relationship
  onDelete: "CASCADE",
});
Organization.hasMany(Artist, {
  foreignKey: "organization_id", // Reference in the artist model
  as: "artists", // Alias for the relationship
  onDelete: "CASCADE"
});

// Playlist associations
Playlist.belongsTo(User, { foreignKey: "user_id", as: "user" });
Playlist.belongsToMany(Track, { through: "playlist_tracks", foreignKey: "playlist_id", as: "tracks" });

// Track associations
Track.belongsToMany(Playlist, { through: "playlist_tracks", foreignKey: "track_id", as: "playlists" });

// UserFollow associations
UserFollow.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
UserFollow.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
});

// Sync models (synchronize the database)
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synchronized!");
  } catch (err) {
    console.error("Error synchronizing the database:", err);
  }
};

// Run the sync
syncModels();

// Export the models
module.exports = {
  User,
  Organization,
  Artist,
  Album,
  Track,
  Favorite,
  Playlist,
  UserFollow,
  RecentlyPlayed,
  PlaylistTrack,
};
