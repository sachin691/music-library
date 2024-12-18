const { Album, Artist } = require("../models"); // Import the models
const STATUS_CODES = require("../constants/statusCodes"); // Import the status codes

const getAllAlbums = async (req, res) => {
  try {
    // Extract query parameters with default values
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;
    const organizationId = req.user.organization_id;

    // Initialize the 'where' clause with the organization ID
    const whereClause = { organization_id: organizationId };

    // Add filters based on query parameters
    if (artist_id) whereClause.artist_id = artist_id; // Filter by artist ID
    if (hidden !== undefined) whereClause.hidden = hidden; // Filter by visibility status

    // Fetch albums with Sequelize, including the associated artist information
    const albums = await Album.findAll({
      where: whereClause,
      limit: parseInt(limit, 10), // Limit the number of results
      offset: parseInt(offset, 10), // Skip a number of results based on offset
      include: [
        {
          model: Artist, // Include the Artist model
          as: "artist", // Alias for the relationship
          attributes: ["name"], // Fetch only the artist name
        },
      ],
      attributes: [
        "id",
        "title",
        "year",
        "hidden",
        "release_date",
        "genre",
        "cover_image",
        "tags",
        "created_at",
        "updated_at",
      ], // Fetch only necessary fields for albums
    });

    // Return the albums in the response
    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: albums.map((album) => ({
        album_id: album.id,
        artist_name: album.artist.name, // Include the artist name in the response
        name: album.title,
        year: album.year,
        hidden: album.hidden,
      })),
      message: "Albums retrieved successfully.",
      error: null,
    });
  } catch (error) {
    // Handle errors and send the error response
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: STATUS_CODES.BAD_REQUEST,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
};

module.exports = { getAllAlbums };
