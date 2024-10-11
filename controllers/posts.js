const Post = require('../models/post');
const Resident = require('../models/resident');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');

module.exports.getPosts = (req, res, next) => {
  Post.find({})
    .populate({
      path: 'authors',
      populate: ['host', 'resident'],
    })
    .populate('likes')
    .then((posts) => {
      if (posts.length === 0) {
        throw new BadRequestError('No posts found');
      }
      res.status(200).send(posts); // Send back the list of residents
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

module.exports.createPost = (req, res, next) => {
  const { text, photoUrl, residentId } = req.body;
  const host = req.user._id;
  const resident = residentId;
  Post.create({ text, photoUrl, authors: { resident, host } })
    .then((post) => {
      return Promise.all([
        User.findByIdAndUpdate(
          host,
          {
            $push: {
              posts: post,
            },
          },
          { new: true }
        ),
        Resident.findByIdAndUpdate(
          residentId,
          {
            $push: {
              posts: post,
            },
          },
          { new: true }
        ),
      ]).then(() => post); // need this as we send updated authors within post data
    })
    .then((post) =>
      res.status(201).send({
        text: post.text,
        photoUrl: post.photoUrl,
        authors: post.authors,
        likes: post.likes,
        createdAt: post.createdAt,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
};

module.exports.updateResident = (req, res, next) => {};
