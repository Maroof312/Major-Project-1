if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
// const Joi = require("joi");

let port = 8080;
const dbUrl = process.env.ATLASDB_URL;

main().then( () => {
    console.log("successful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set ("view engine","ejs");
app.set ("views", path.join(__dirname, "/views"))
app.use(express.json());
app.use (express.urlencoded ({extended: true}));
app.use (methodOverride("_method"));
app.use (express.static (path.join(__dirname, "/public")))
app.use (cookieParser());
app.engine ("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env,SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7/*(Days)*/ * 24/*(Hours)*/ * 60/*(Min)*/ * 60/*(Sec)*/ * 1000,/*(Mil.Sec)*/
        maxAge: 7/*(Days)*/ * 24/*(Hours)*/ * 60/*(Min)*/ * 60/*(Sec)*/ * 1000,/*(Mil.Sec)*/
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize()); /*A middleware that initializes passport*/
app.use(passport.session()); /*To identify series of request is from same user in a session*/
passport.use(new localStrategy(User.authenticate())); /*Use static authenticate method of model in localStrorage*/
passport.serializeUser(User.serializeUser()); /* To store user related info in a session */
passport.deserializeUser(User.deserializeUser()); /* When user ends its session we have to deserialize user */

app.use((req, res, next) => {
    res.locals.Success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// 
// app.get("/", (req, res) => {
//     res.send("Hi! Welcome to Home Page");
// });

// Listing
app.use("/listings", listings);

// Review
app.use("/listings/:id/reviews", reviews);

// User
app.use("/", user);


app.all("*", (req, res, next) => {
    next(new ExpressError (404, "Page Not Found!"));
});

// Custom Error Handling
app.use ((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {statusCode, message});
    // res.render("error.ejs", {err});
});

app.listen (port, ()=> {
    console.log(`Listning to ${port}`)
});