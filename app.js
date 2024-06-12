const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const Campground = require("./models/campground");
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
.then(() => {
    console.log("MongoDBコネクションOK!");
})
.catch(err => {
    console.log("MongoDBコネクションエラー");
    console.log(err);
});

const app = express();

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get("/",(req,res)=>{
    res.render("home");
});
//キャンプ場一覧
app.get("/campgrounds",async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index",{campgrounds});
});
//:idよりも先に書く（/newが:idとして認識されてしまう）
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
});
//キャンプ場の詳細画面への遷移
app.get("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show",{campground});
});
//新規作成のPOST処理
app.post("/campgrounds",async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
//編集画面への遷移
app.get("/campgrounds/:id/edit",async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit",{campground});
});
//編集のPUT処理
app.put("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
});
app.delete("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});
app.listen("3000",()=>{
    console.log("ポート3000でサーバーを起動しました!");
})
