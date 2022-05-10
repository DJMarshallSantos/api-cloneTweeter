const tweetService = require("./tweets.service");

const createTweetController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).send({
        message: "Please provide a message!",
      });
    }

    const { id } = await tweetService.createTweetService(message, req.userId);

    return res.send({
      message: "A Tweet has been successfully created!",
      tweet: { id, message },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAllTweetsController = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 6;
    }

    if (!offset) {
      offset = 0;
    }

    const tweets = await tweetService.findAllTweetsService(offset, limit);

    const total = await tweetService.countTweets();

    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (tweets.length === 0) {
      return res.status(400).send({ message: "There are no Tweets!" });
    }

    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchTweetController = async (req, res) => {
  const { message } = req.query;

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "There is no such Tweet!" });
  }

  return res.send({
    tweets: tweets.map((tweet) => ({
      id: tweet._id,
      message: tweet.message,
      likes: tweet.likes.length,
      comments: tweet.comments.length,
      retweets: tweet.retweets.length,
      name: tweet.user.name,
      username: tweet.user.username,
      avatar: tweet.user.avatar,
    })),
  });
};

const likeTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  const tweetLiked = await tweetService.likesService(id, userId);

  if (tweetLiked.lastErrorObject.n === 0) {
    return res.status(400).send({ message: "You've already liked this Tweet!" });
  }

  return res.send({
    message: "Tweet liked successfully!",
  });
};

const retweetTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  const tweetRetweeted = await tweetService.retweetsService(id, userId);

  if (tweetRetweeted.lastErrorObject.n === 0) {
    return res
      .status(400)
      .send({ message: "You've already retweed this Tweet!" });
  }

  return res.send({
    message: "Tweet retweeted successfully!",
  });
};

const commentTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  await tweetService.commentsService(id, userId);

  return res.send({
    message: "Tweet commented!",
  });
};

module.exports = {
  createTweetController,
  findAllTweetsController,
  searchTweetController,
  likeTweetController,
  retweetTweetController,
  commentTweetController,
};