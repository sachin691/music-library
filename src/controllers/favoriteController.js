const { Favorite, Artist, Album, Track } = require("../models"); // Import models
const { STATUS_CODES, CATEGORIES } = require("../utils/constants");

const getFavorites = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from route parameter
    const { limit = 5, offset = 0 } = req.query; // Extract query parameters with default values
    const { id: userId } = req.user; // Logged-in user's ID from middleware (authenticate)

    // Validate category
    if (!Object.values(CATEGORIES).includes(category.toLowerCase())) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Invalid category. Use 'artist', 'album', or 'track'.",
        error: null,
      });
    }

    // Map category to corresponding model and association
    const associations = {
      [CATEGORIES.ARTIST]: { model: Artist, alias: "artist", fieldName: "name" },
      [CATEGORIES.ALBUM]: { model: Album, alias: "album", fieldName: "title" },
      [CATEGORIES.TRACK]: { model: Track, alias: "track", fieldName: "title" },
    };

    const { model, alias, fieldName } = associations[category.toLowerCase()];

    // Fetch favorites based on category
    const favorites = await Favorite.findAll({
      where: {
        user_id: userId,
        favorite_type: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category for DB ENUM
      },
      include: [
        {
          model,
          as: alias,
          attributes: ["id", fieldName], // Select item ID and name/title field
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    // Transform data into the desired format
    const transformedData = favorites.map((fav) => ({
      favorite_id: fav.id,
      category,
      item_id: fav[alias]?.id,
      name: fav[alias]?.[fieldName],
      created_at: fav.created_at,
    }));

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: transformedData,
      message: "Favorites retrieved successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


const addFavorite = async (req, res) => {
  try {
    const { category, item_id } = req.body;
    const { id: userId } = req.user;

    if (!item_id || !category) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    // Validate category
    if (!Object.values(CATEGORIES).includes(category.toLowerCase())) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: `Invalid category. Use '${CATEGORIES.ARTIST}', '${CATEGORIES.ALBUM}', or '${CATEGORIES.TRACK}'.`,
        error: null,
      });
    }
    

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: userId,
        favorite_type: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category for DB ENUM
        item_id,
      },
    });

    if (existingFavorite) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "This item is already in your favorites.",
        error: null,
      });
    }

    // Add the new favorite
    await Favorite.create({
      user_id: userId,
      favorite_type: category.charAt(0).toUpperCase() + category.slice(1),
      item_id,
    });

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: null,
      message: "Favorite added successfully.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assumes `authenticate` middleware adds `req.user`

    // Find the favorite by ID and user ID
    const favorite = await Favorite.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    // Check if favorite exists
    if (!favorite) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Favorite not found.",
        error: null,
      });
    }

    // Delete the favorite
    await favorite.destroy();

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: "Favorite removed successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: null,
      message: "An error occurred while removing the favorite.",
      error: error.message,
    });
  }
};


module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
