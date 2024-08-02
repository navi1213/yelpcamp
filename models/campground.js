const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
//スキーマを定義
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image:String,
    author: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[ 
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
campgroundSchema.post("findOneAndDelete",async function(doc){
    if(doc) {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
});
// モデルを作成してエクスポート
module.exports = mongoose.model("Campground", campgroundSchema);
