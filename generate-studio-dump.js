const fs = require("fs");
const path = require("path");

const imageFolder = path.join(__dirname, "assets", "studio-dump");
const outputFile = path.join(__dirname, "studio-dump-data.js");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const files = fs
  .readdirSync(imageFolder)
  .filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return allowedExtensions.includes(ext);
  })
  .sort((a, b) => {
    const aTime = fs.statSync(path.join(imageFolder, a)).mtimeMs;
    const bTime = fs.statSync(path.join(imageFolder, b)).mtimeMs;
    return bTime - aTime;
  })
  .map((file) => `assets/studio-dump/${file}`);

const output = `window.studioDumpImages = ${JSON.stringify(files, null, 2)};\n`;

fs.writeFileSync(outputFile, output);

console.log(`Generated studio-dump-data.js with ${files.length} images.`);