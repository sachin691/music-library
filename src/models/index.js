// src/models/index.js

const sequelize = require("../config/index");
const User = require("./User");
const Organization = require("./Organization");
const Artist = require("./Artist");
const Album = require("./Album");
const Track = require("./Track");
const Favorite = require("./Favorite");
const Playlist = require("./Playlist");
const UserFollow = require("./UserFollow");
const RecentlyPlayed = require("./RecentlyPlayed");



const syncModels = async () => {
  try {
    await sequelize.sync({ force: true }); 
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
