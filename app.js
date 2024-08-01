const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const { error } = require("console");
const session = require("express-session");
const flash = require("connect-flash");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDBコネクションOK!");
  })
  .catch((err) => {
    console.log("MongoDBコネクションエラー");
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveuninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/fakeUser",async(req,res)=>{
//   const user = new User({email:"hogehoge@examlple.com",username:"hogehoge"});
//   const newUser = await User.register(user,"mogegege");
//   res.send(newUser);
// });
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/",userRoutes);

//エラーハンドリング
app.all("*", (req, res, next) => {
  next(new ExpressError("ページが見つかりません", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "問題が起きました" } = err;
  if (!err.message) err.message = "問題が発生しました";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("ポート3000でサーバーを起動しました!");
});
