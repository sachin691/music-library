// src/models/index.js

const sequelize = require("../config/index.js");
const User = require("./User");
const Organization = require("./Organization");

// Sync models with the database
// sequelize
//   .sync({ force: true }) // `force: true` drops the table if it already exists
//   .then(() => {
//     console.log("Database synchronized!");
//   })
//   .catch((err) => {
//     console.error("Error synchronizing the database:", err);
//   });

const syncModels = async () => {
  try {
    await sequelize.sync({ force: true }); // Use force: false for production
    console.log("Database synchronized!");
  } catch (err) {
    console.error("Error synchronizing the database:", err);
  }
};

// Run the sync
syncModels();
