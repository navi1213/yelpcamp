const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer  = require('multer')
const {storage} = require("../cloudinary")
const upload = multer({ storage })

router
  .route("/")
  //キャンプ場一覧
  .get(catchAsync(campgrounds.index))
  // 新規作成のPOST処理
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
  
//新規作成画面への遷移(:idよりも先に書く（/newが:idとして認識されてしまう）)
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  //キャンプ場の詳細画面への遷移
  .get(catchAsync(campgrounds.showCampgrounds))
  //編集のPUT処理
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
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
