const Joi = require('joi');

module.exports.listingSchema = Joi.object({
     listing : Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          location: Joi.string().required(),
          price: Joi.number().required(),
          country: Joi.string().required().min(0),
          image:Joi.string().allow("",null)
     }).required()
})

module.exports.reviewSchema = Joi.object({
     review : Joi.object({
          comment: Joi.string().required(),
          rating: Joi.number().required().min(1).max(5),
     }).required()
});


// bluecity0000
// mongodb+srv://explorerknown:<db_password>@user-data-cluster.j4em8.mongodb.net/?retryWrites=true&w=majority&appName=user-data-cluster