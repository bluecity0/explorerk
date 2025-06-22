if (process.env.NODE_ENV != "production") {
     require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const cookieParser = require("cookie-parser");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const emitter = require('events');
emitter.defaultMaxListeners = 20;
const dbUrl = process.env.ATLASDB_URL;



async function main() {
     try {
          console.log("Connecting to DB:", dbUrl);
          await mongoose.connect(dbUrl);
          console.log("✅ Connected to MongoDB");
     } catch (err) {
          console.error("❌ MongoDB connection error:", err);
     }
}


main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));


const store = MongoStore.create({
     mongoUrl: dbUrl,
     crypto:{
          secret:process.env.SECRET,
     },
     touchAfter:24*3600,

});

store.on("errror",()=>{
     console.log("Error in mongo session store");
});

const sessionOption = {
     store,
     secret: process.env.SECRET,
     resave: false,
     saveUninitialized: true,
     cookie: {
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true
     }
};

//root route
// app.get("/",(req,res)=>{
//      res.send("hy i am root");    
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
     next();
});

// app.get("/demouser",async (req,res)=>{
//      let fakeUser = new User({
//           email:"student@gmail.com",
//           username:"delta-student"
//      });

// let registerUser = await User.register(fakeUser,"helloworld");
// res.send(registerUser)
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

app.use("/", (req, res, next) => {
     next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
     let { statusCode = 500, message = "Something went wrong" } = err;
     res.status(statusCode).render("error.ejs", { err })
});

//port
app.listen(1111, () => {
     console.log("server is running on port 1111");
});

// app.get("/testlisting",async (req,res)=>{
//      let samplelisting = new Listing({
//      title: "my new villa",
//      description: "by rhe beach",
//      price: 1000000,
//      location: "mumbai",
//      country: "india",
//      });
//      res.send(samplelisting);
//      await samplelisting.save();
//      console.log("sample was saved")
//});
