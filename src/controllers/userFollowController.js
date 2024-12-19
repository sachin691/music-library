const UserFollow = require("../models/UserFollow");
const Artist = require("../models/Artist");

const { STATUS_CODES } = require("../utils/constants");

const followArtist = async (req, res) => {
  try {
    const { artist_id } = req.body; 
    const { id: user_id } = req.user; 

    // Check if the user is already following the artist
    const existingFollow = await UserFollow.findOne({
      where: { user_id, artist_id },
    });

    if (existingFollow) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "You are already following this artist.",
        error: null,
      });
    }

    // Create a new follow record
    const follow = await UserFollow.create({ user_id, artist_id });
    await Artist.incrementFollowers(artist_id);

    return res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      data: { follow_id: follow.id },
      message: "Artist followed successfully.",
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

const unFollowArtist = async (req, res) => {
  try {
    const { artist_id } = req.params; 
    const { id: user_id } = req.user; 

    const follow = await UserFollow.findOne({
      where: { user_id, artist_id },
    });

    if (!follow) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: STATUS_CODES.NOT_FOUND,
        data: null,
        message: "Follow record not found.",
        error: null,
      });
    }

    await follow.destroy();
    await Artist.decrementFollowers(artist_id);

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: null,
      message: "Artist unfollowed successfully.",
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

const getFollowings = async (req, res) => {
  try {
    const { limit = 10, offset = 0, name } = req.query; 
    const { id: user_id } = req.user; 

    const whereClause = name ? { user_id, "$artist.name$": { [Op.iLike]: `%${name}%` } } : { user_id };

    const follows = await UserFollow.findAll({
      where: whereClause,
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Format the response
    const formattedFollows = follows.map((follow) => ({
      follow_id: follow.id,
      artist_id: follow.artist.id,
      artist_name: follow.artist.name,
      followed_at: follow.created_at,
    }));

    return res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: formattedFollows,
      message: "Followings retrieved successfully.",
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

module.exports = {
  followArtist,
  unFollowArtist,
  getFollowings,
};
