const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  //キャンプ場一覧
  .get(catchAsync(campgrounds.index))
  //新規作成のPOST処理
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

//:idよりも先に書く（/newが:idとして認識されてしまう）
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  //キャンプ場の詳細画面への遷移
  .get(catchAsync(campgrounds.showCampgrounds))
  //編集のPUT処理
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  //削除のDELETE処理
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//編集画面への遷移
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
