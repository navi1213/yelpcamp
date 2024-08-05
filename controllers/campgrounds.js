const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.showCampgrounds = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "キャンプ場が見つかりませんでした");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "新しいキャンプ場を登録しました");
    res.redirect(`/campgrounds/${campground._id}`);
  };
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "キャンプ場が見つかりませんでした");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  };
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { runValidators: true }
    );
    req.flash("success", "キャンプ場情報を更新しました");
    res.redirect(`/campgrounds/${camp._id}`);
  };
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "キャンプ場を削除しました");
    res.redirect("/campgrounds");
  };  