const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
//キャンプ場一覧
router.get("/", catchAsync(campgrounds.index));
//:idよりも先に書く（/newが:idとして認識されてしまう）
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//キャンプ場の詳細画面への遷移
router.get("/:id", catchAsync(campgrounds.showCampgrounds));
//新規作成のPOST処理
router.post("/",isLoggedIn,validateCampground,
  catchAsync(campgrounds.postCampground)
);
//編集画面への遷移
router.get("/:id/edit",isLoggedIn,isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
//編集のPUT処理
router.put("/:id",isLoggedIn,isAuthor,validateCampground,
  catchAsync(campgrounds.updateCampground)
);
//削除のDELETE処理
router.delete("/:id",isLoggedIn,isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
