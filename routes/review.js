const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")

const {validateReview, isLoggedIn,reviewOwner} =require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//reviews
//post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId",isLoggedIn,reviewOwner,wrapAsync(
reviewController.deleteReview));

module.exports = router;
