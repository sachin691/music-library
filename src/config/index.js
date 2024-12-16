// src/config/index.js

const { Sequelize } = require("sequelize");
const dbConfig = require("./database");

// Load environment variables
require("dotenv").config();

// Set up the Sequelize instance
const environment = process.env.NODE_ENV || "development";
const config = dbConfig[environment];

// Create a new Sequelize instance with the configuration
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Run the test connection
testConnection();

module.exports = sequelize;
