const { Sequelize } = require("sequelize");
require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const dbConfig = require("./database");
const config = dbConfig[environment];

// Sequelize instance creation
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: process.env.DB_HOST,
  dialect: "postgres", 
  logging: false, 
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
