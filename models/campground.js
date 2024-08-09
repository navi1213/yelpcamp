const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
//スキーマを定義
// https://res.cloudinary.com/dtaye3q8v/image/upload/c_thumb,g_face,h_500,w_500/v1722951130/YelpCamp/iwtciw1iuiqxx46kd5ks.png
const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [imageSchema],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
campgroundSchema.set('toJSON', { virtuals: true});
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
campgroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,20)}...</p>`;
});
// モデルを作成してエクスポート
module.exports = mongoose.model("Campground", campgroundSchema);
