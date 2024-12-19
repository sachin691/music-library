const Organization = require("../models/Organization");

const initializeDefaultOrganization = async () => {
  // Check if an organization already exists
  const existingOrg = await Organization.findOne();
  if (!existingOrg) {
    // Create a default organization
    const defaultOrg = await Organization.create({
      name: "Voosh", // You can customize the name
    });

    return defaultOrg;
  }
  return existingOrg;
};

module.exports = initializeDefaultOrganization;
