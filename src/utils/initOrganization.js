const Organization = require("../models/Organization");

const initializeDefaultOrganization = async () => {
  // Check if an organization already exists
  const existingOrg = await Organization.findOne();
  if (!existingOrg) {
    const defaultOrg = await Organization.create({
      name: "Voosh",
    });

    return defaultOrg;
  }
  return existingOrg;
};

module.exports = initializeDefaultOrganization;
