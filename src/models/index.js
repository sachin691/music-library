const sequelize = require("../config/index"); // Ensure this exports a Sequelize instance
const Album = require("./Album");
const Artist = require("./Artist");
const Favorite = require("./Favorite");
const Organization = require("./Organization");
const Playlist = require("./Playlist");
const PlaylistTrack = require("./PlaylistTrack");
const Track = require("./Track");
const User = require("./User");
const UserFollow = require("./UserFollow");

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

Artist.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization", // Alias for the relationship
  onDelete: "CASCADE",
});

Artist.hasMany(Album, {
  foreignKey: "artist_id",
  as: "albums", // Alias for the relationship
  onDelete: "CASCADE",
});

Artist.hasMany(Track, {
  foreignKey: "artist_id",
  as: "tracks", // Alias for the relationship
  onDelete: "CASCADE",
});

Artist.belongsToMany(User, {
  through: UserFollow,
  foreignKey: "artist_id",
  as: "followers", // Alias for the relationship (many-to-many through UserFollow)
});

Favorite.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Polymorphic association: Favorite can belong to Artist, Album, or Track
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

Organization.hasMany(User, {
  foreignKey: "organization_id",
  as: "users", // Alias for the relationship
  onDelete: "CASCADE",
});

// Association with Artist: One organization can have many artists
Organization.hasMany(Artist, {
  foreignKey: "organization_id",
  as: "artists", // Alias for the relationship
  onDelete: "CASCADE",
});

Playlist.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Playlist belongs to many Tracks (many-to-many via PlaylistTrack)
Playlist.belongsToMany(Track, {
  through: PlaylistTrack,
  foreignKey: "playlist_id",
  as: "tracks",
});

Track.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
});

// Track belongs to Album (many-to-one)
Track.belongsTo(Album, {
  foreignKey: "album_id",
  as: "album",
});

// Track belongs to Organization (many-to-one)
Track.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

// Track belongs to many Playlists (many-to-many via playlist_tracks)
Track.belongsToMany(Playlist, {
  through: PlaylistTrack,
  foreignKey: "track_id",
  as: "playlists",
});

User.hasMany(Playlist, {
  foreignKey: "user_id",
  as: "playlists",
  onDelete: "CASCADE",
});

// A user can belong to an organization
User.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

// A user can have many favorites
User.hasMany(Favorite, {
  foreignKey: "user_id",
  as: "favorites",
});

// A user can follow many artists
User.belongsToMany(Artist, {
  through: "user_artists",
  foreignKey: "user_id",
  as: "followed_artists",
});

UserFollow.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// UserFollow belongs to Artist
UserFollow.belongsTo(Artist, {
  foreignKey: "artist_id",
  as: "artist",
});

PlaylistTrack.belongsTo(Track, {
  foreignKey: "track_id", // Track reference
  as: "tracks", // Alias for the track association
});

PlaylistTrack.belongsTo(Playlist, {
  foreignKey: "playlist_id", // Playlist reference
  as: "playlist", // Alias for the playlist association
});

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
