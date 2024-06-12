const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//スキーマを定義
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image:String,
});
// モデルを作成してエクスポート
module.exports = mongoose.model("Campground", campgroundSchema);
