if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose
  .connect(dbUrl, {
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
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
const secret = process.env.SECRET || "mysecret"
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypt:{
    secret
  },
  touchAfter:24*3600
});
store.on("error",e=>{
  console.log("セッションストアエラー",e);
})
const sessionConfig = {
  store,
  name:"hoge",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
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
app.use(helmet({}));

const scriptSrcUrls = [
  'https://api.mapbox.com',
  'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
  'https://api.mapbox.com',
  'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
  `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
  'https://images.unsplash.com'
];

app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls]
  }
}));

app.use((req, res, next) => {
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ポート${port}でサーバーを起動しました!`);
});
