"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a new UUID column
    await queryInterface.addColumn("playlist_tracks", "new_id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    });

    // Step 2: Copy the values from the old `id` column to the new `new_id` column (optional)
    // If there is a need to retain any data, you can update the new column with data from the old column
    // For example: await queryInterface.sequelize.query(`UPDATE playlist_tracks SET new_id = id`);

    // Step 3: Drop the old `id` column
    await queryInterface.removeColumn("playlist_tracks", "id");

    // Step 4: Rename the new column to `id`
    await queryInterface.renameColumn("playlist_tracks", "new_id", "id");
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting: Drop the new `id` column and add back the old one (if necessary)

    // Step 1: Add the old column back (if you need to rollback)
    await queryInterface.addColumn("playlist_tracks", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    });

    // Step 2: Drop the new `UUID` column
    await queryInterface.removeColumn("playlist_tracks", "new_id");
  },
};
