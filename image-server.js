const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

// Folders inside 'public'
const storyImagesFolder = path.join(__dirname, 'public', 'storyImages');
const userPhotosFolder = path.join(__dirname, 'public', 'userPhotos');

// Serve static folders
app.use('/storyImages', express.static(storyImagesFolder));
app.use('/userPhotos', express.static(userPhotosFolder));

// Helper function to list image files
function getImages(folderPath) {
  try {
    return fs.readdirSync(folderPath).filter(file => {
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file).toLowerCase());
    });
  } catch (err) {
    console.error(`Error reading directory ${folderPath}`, err);
    return [];
  }
}

app.get('/', (req, res) => {
  const storyImages = getImages(storyImagesFolder);
  const userPhotos = getImages(userPhotosFolder);

  let html = `
    <h1>🖼️ Image Gallery</h1>
    <h2>📁 storyImages</h2>
  `;

  storyImages.forEach(image => {
    html += `<img src="/storyImages/${image}" alt="${image}" style="max-width:300px; margin:10px;">`;
  });

  html += `<h2>📁 userPhotos</h2>`;
  userPhotos.forEach(image => {
    html += `<img src="/userPhotos/${image}" alt="${image}" style="max-width:300px; margin:10px;">`;
  });

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`✅ Image server running at http://localhost:${PORT}`);
});

