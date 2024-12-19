const { Sequelize } = require("sequelize");
require("dotenv").config();

// Make sure the environment variable NODE_ENV is set (defaults to "development")
const environment = process.env.NODE_ENV || "development";

// Import the configuration from your dbConfig (make sure this file exists and has valid configuration)
const dbConfig = require("./database");
const config = dbConfig[environment];

// Log an error if critical environment variables are missing
// if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
//   console.error("Missing database environment variables!");
//   process.exit(1); // Exit the process with an error
// }

// Sequelize instance creation
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: process.env.DB_HOST,
  dialect: "postgres", // or mysql, sqlite, etc.
  logging: false, // Optional: disable logging of queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

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
