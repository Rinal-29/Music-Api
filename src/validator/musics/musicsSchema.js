const Joi = require('joi');

const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const currentYear = new Date().getFullYear();
const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const playlistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const playlistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  albumPayloadSchema, songPayloadSchema, playlistPayloadSchema, playlistSongPayloadSchema,
};
