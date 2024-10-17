const Resident = require('../models/resident');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');

module.exports.getResidents = (req, res, next) => {
  // Extract residentIds from query, which can be a single ID or an array
  let { id: residentIds } = req.query;
  if (!residentIds) {
    return next(new BadRequestError('No resident IDs were provided'));
  }

  // If a single ID is passed, convert it to an array
  if (!Array.isArray(residentIds)) {
    residentIds = [residentIds];
  }

  return Resident.find({ _id: { $in: residentIds } })
    .then((residents) => {
      if (residents.length === 0) {
        throw new BadRequestError('No residents found with the provided IDs');
      }
      res.status(200).send(residents); // Send back the list of residents
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

module.exports.createResident = (req, res, next) => {
  const { name, avatar, species, bio, bday } = req.body;
  const host = req.user._id;
  Resident.create({ name, avatar, species, bio, bday, host })
    .then((resident) => {
      User.findByIdAndUpdate(
        host,
        {
          $push: {
            residents: resident,
          },
        },
        { new: true }
      ).then(() =>
        res.status(201).send({
          name: resident.name,
          avatar: resident.avatar,
          species: resident.species,
          bio: resident.bio,
          bday: resident.bday,
          host: resident.host.name,
        })
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

module.exports.updateResident = (req, res, next) => {
  // TODO: Implement updateResident function
  console.log(req, res);
};
