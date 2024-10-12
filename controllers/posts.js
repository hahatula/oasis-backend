const Post = require('../models/post');
const Resident = require('../models/resident');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

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

module.exports.updatePost = (req, res, next) => {
  const { text } = req.body;
  const { itemId } = req.params;

  Post.findById(itemId)
    .orFail(() => {
      throw new NotFoundError('Requested resource not found');
    })
    .then((post) => {
      if (post.authors.host.equals(req.user._id)) {
        post.update({ text }, { new: true }).then((post) => {
          res.send(post);
        });
      } else {
        throw new ForbiddenError('No permission');
      }
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
      } else {
        throw new ForbiddenError('No permission');
      }
    })
    .then((post) => {
      return post
        .delete()
        .then(() =>
          res.send({ message: 'The post was successfully deleted.' })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      }
      return next(err);
    });
};
