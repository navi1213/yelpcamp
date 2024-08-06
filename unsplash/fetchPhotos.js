const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// Unsplash APIキーとコレクションIDを環境変数から取得
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const COLLECTION_ID = process.env.UNSPLASH_COLLECTION_ID;

// 選ばれたコレクションからランダムな写真を取得する関数
async function getRandomPhotoFromCollection(collectionId) {
  const url = `https://api.unsplash.com/collections/${collectionId}/photos?client_id=${ACCESS_KEY}`;
  const response = await axios.get(url);
  const photos = response.data;
  
  if (photos.length === 0) {
    throw new Error('No photos found in the selected collection');
  }
  
  return photos[Math.floor(Math.random() * photos.length)];
}

// 50回ランダムな写真を取得してファイルに保存する関数
async function fetchPhotos() {
  const photoUrls = [];
  for (let i = 0; i < 50; i++) {
    try {
      const randomPhoto = await getRandomPhotoFromCollection(COLLECTION_ID);
      // `regular`サイズの画像URLを取得
      const photoUrl = randomPhoto.urls.regular;
      photoUrls.push(photoUrl);
      console.log(`Fetched URL ${i + 1}: ${photoUrl}`);
    } catch (error) {
      console.error(`Error fetching photo ${i + 1}`, error);
    }
  }

  // ファイルに保存
  fs.writeFileSync('photoUrls.txt', photoUrls.join('\n'), 'utf8');
  console.log('All photo URLs have been saved to photoUrls.txt');
}

fetchPhotos();

