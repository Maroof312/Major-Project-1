const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listDetail = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listDetail) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    // console.log(listDetail);
    res.render("listings/show.ejs", {listDetail});
};

module.exports.createListing = async (req, res, next) => { 
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }) 
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing (req.body);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("Success", "New Listing Created");
    return res.redirect("/listings");
};
    
module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const editListing = await Listing.findById(id);
    if (!editListing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", {editListing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let editListing = await Listing.findByIdAndUpdate(id, req.body);
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        editListing.image = {url, filename};
        await editListing.save();
    }
    req.flash("Success", "Listing Updated");
    return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    req.flash("Success", "Listing Deleted");
    return res.redirect("/listings");
};