// src/models/index.js

const sequelize = require("../config/index");
const Organization = require("./Organization");
const User = require("./User");
const Artist = require("./Artist");
const Album = require("./Album");
const Track = require("./Track");
const Favorite = require("./Favorite");
const Playlist = require("./Playlist");
const UserFollow = require("./UserFollow");
const RecentlyPlayed = require("./RecentlyPlayed");



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
};
