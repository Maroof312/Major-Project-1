const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://maroof:maroof@127.0.0.1:27017/wanderlust?authSource=admin';

main().then( () => {
    console.log("successful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "671b44f31edc5f569b03304b",}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
};

initDB();