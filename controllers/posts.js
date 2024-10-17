const Post = require('../models/post');
const Resident = require('../models/resident');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const NotFoundError = require('../utils/errors/NotFoundError');

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
    .then(
      (post) =>
        Promise.all([
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
        ]).then(() => post) // need this as we send updated authors within post data
    )
    .then((post) =>
      Post.findById(post._id)
        .populate({
          path: 'authors',
          populate: ['host', 'resident'],
        })
        .populate('likes')
    )
    .then((post) => res.status(201).send(post))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
};

module.exports.updatePost = (req, res, next) => {
  const { text } = req.body;
  const { itemId } = req.params;

  Post.findById(itemId)
    .orFail(() => {
      throw new NotFoundError('Requested resource not found');
    })
    .then((post) => {
      if (post.authors.host.equals(req.user._id)) {
        return Post.findByIdAndUpdate(itemId, { text }, { new: true });
      }
      throw new ForbiddenError('No permission');
    })
    .then((post) => {
      res.send(post);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
};

module.exports.deletePost = (req, res, next) => {
  const { itemId } = req.params;

  Post.findById(itemId)
    .orFail(() => {
      throw new NotFoundError('Requested resource not found');
    })
    .then((post) => {
      if (post.authors.host.equals(req.user._id)) {
        return Promise.all([
          User.findByIdAndUpdate(
            post.authors.host,
            {
              $pull: { posts: post._id },
            },
            { new: true }
          ),
          Resident.findByIdAndUpdate(
            post.authors.resident,
            {
              $pull: { posts: post._id },
            },
            { new: true }
          ),
        ]).then(() => post);
      }
      throw new ForbiddenError('No permission');
    })
    .then((post) =>
      post
        .delete()
        .then(() => res.send({ message: 'The post was successfully deleted.' }))
    )
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
};

module.exports.likePost = (req, res, next) =>
  Post.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Requested resource not found');
    })
    .then((post) =>
      Post.findById(post._id)
        .populate({
          path: 'authors',
          populate: ['host', 'resident'],
        })
        .populate('likes')
    )
    .then((post) => res.send(post))
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });

module.exports.dislikePost = (req, res, next) =>
  Post.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Requested resource not found');
    })
    .then((post) =>
      Post.findById(post._id)
        .populate({
          path: 'authors',
          populate: ['host', 'resident'],
        })
        .populate('likes')
    )
    .then((post) => res.send(post))
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
