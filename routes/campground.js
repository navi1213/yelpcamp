const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//キャンプ場一覧
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//:idよりも先に書く（/newが:idとして認識されてしまう）
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
//キャンプ場の詳細画面への遷移
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "キャンプ場が見つかりませんでした");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//新規作成のPOST処理
router.post(
  "/",isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("不正なキャンプ場データです", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "新しいキャンプ場を登録しました");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//編集画面への遷移
router.get(
  "/:id/edit",isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "キャンプ場が見つかりませんでした");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
//編集のPUT処理
router.put(
  "/:id",isLoggedIn,
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
    req.flash("success", "キャンプ場情報を更新しました");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//削除のDELETE処理
router.delete(
  "/:id",isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "キャンプ場を削除しました");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
