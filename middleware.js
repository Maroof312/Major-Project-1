const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.user);
        req.flash("error", "You are not a user");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let editListing = await Listing.findById(id);
    if(!editListing.owner._id.equals (res.locals.currUser._id)) {
        req.flash("error", "User access denied");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// Validation schema in Middleware
module.exports.validateListing = (req, res, next) => {
    console.log("Incoming request body:", req.body);
    const data = req.body.editListing ? req.body.editListing : req.body;
    let {error} = listingSchema.validate(data);
        // console.log(result);
    if (error) {
        throw new ExpressError(400, error);
    }
        next ();
}

// Validation schema for review in Middleware
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
        // console.log(result);
    if (error) {
        throw new ExpressError(400, error);
    }
        next ();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals (res.locals.currUser._id)) {
        req.flash("error", "This User did not created the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
