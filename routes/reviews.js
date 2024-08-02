const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const { isLoggedIn,validateReview,isReviewAuthor } = require("../middleware");
//レビューのPOST処理
router.post(
  "/",
  isLoggedIn,validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "新しいレビューを登録しました");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//レビューの削除処理
router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "レビューを削除しました");
    res.redirect(`/campgrounds/${id}`);
  })
);
module.exports = router;
