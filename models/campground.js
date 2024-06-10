const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//スキーマを定義
const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
});
// モデルを作成してエクスポート
module.exports = mongoose.model("Campground", campgroundSchema);
