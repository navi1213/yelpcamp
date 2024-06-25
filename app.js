const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const { error } = require("console");

mongoose
    .connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.render("home");
});
//キャンプ場一覧
app.get(
    "/campgrounds",
    catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);
//:idよりも先に書く（/newが:idとして認識されてしまう）
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});
//キャンプ場の詳細画面への遷移
app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/show", { campground });
    })
);
//新規作成のPOST処理
app.post(
    "/campgrounds",
    validateCampground,
    catchAsync(async (req, res) => {
        // if(!req.body.campground) throw new ExpressError("不正なキャンプ場データです", 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//編集画面への遷移
app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/edit", { campground });
    })
);
//編集のPUT処理
app.put(
    "/campgrounds/:id",
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(
            id,
            {
                ...req.body.campground,
            },
            { runValidators: true }
        );
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
//削除のDELETE処理
app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    })
);
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
