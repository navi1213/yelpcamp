// このファイルは、データベースに初期データを追加するためのファイルです。
// const path = require('path');
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places,descriptors} = require("./seedHelpers");
const fs = require('fs');
// const photoUrlsPath = path.resolve(__dirname, '../unsplash/photoUrls.txt');
// photoUrls.txtからURLを読み込む
// const photoUrls = fs.readFileSync(photoUrlsPath, 'utf8').split('\n').filter(url => url.trim() !== '');

// console.log('Fetched Photo URLs:', photoUrls);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
.then(() => {
    console.log("MongoDBコネクションOK!");
})
.catch(err => {
    console.log("MongoDBコネクションエラー");
    console.log(err);
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany();
    for(let i=0;i<50;i++){
        const randomCityIndex = Math.floor(Math.random()*cities.length);
        const price = Math.floor(Math.random()*2000)+1000;
        const camp = new Campground({
            author:"66aab8d1c28c766c8817daf2",
            location:`${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title:`${sample(descriptors)}・${sample(places)}`,
            images:[
                {
                  url: 'https://res.cloudinary.com/dtaye3q8v/image/upload/v1722945043/YelpCamp/ufaigjn2ysdv0cmjqusa.jpg',
                  filename: 'YelpCamp/ufaigjn2ysdv0cmjqusa'
                }
              ],
            description:"木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。名高い桟も、蔦のかずらを頼みにしたような危い場処ではなくなって、徳川時代の末にはすでに渡ることのできる橋であった。新規に新規にとできた道はだんだん谷の下の方の位置へと降って来た。道の狭いところには、木を伐って並べ、藤づるでからめ、それで街道の狭いのを補った。長い間にこの木曾路に起こって来た変化は、いくらかずつでも嶮岨な山坂の多いところを歩きよくした。そのかわり、大雨ごとにやって来る河水の氾濫が旅行を困難にする",
            price
        });
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
}).catch(err=>{
    console.log(err);
});