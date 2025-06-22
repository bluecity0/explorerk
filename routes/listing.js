const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,isowner,validateListing,} =require("../middleware.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


const listingController = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn ,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));

router.route("/new")
.get(isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isowner ,wrapAsync (listingController.deleteListing))
.put(isLoggedIn ,isowner,upload.single('listing[image]'),validateListing,wrapAsync (listingController.updateListing));


//edit route
router.get("/:id/edit",isLoggedIn ,isowner,wrapAsync (listingController.editListing));


module.exports = router;