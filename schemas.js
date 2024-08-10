const Joi = require('joi');
const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    campground: joi
        .object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            // image: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required(),
        })
        .required(),
        deleteImages:Joi.array()
});

module.exports.reviewSchema = joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
});