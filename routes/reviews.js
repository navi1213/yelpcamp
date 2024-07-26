const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

//レビューのバリデーション
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//レビューのPOST処理
router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash("success", "新しいレビューを登録しました");
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  //レビューの削除処理
  router.delete("/:reviewId", catchAsync(async (req, res) => {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "レビューを削除しました");
    res.redirect(`/campgrounds/${id}`);
  }));
  module.exports = router;