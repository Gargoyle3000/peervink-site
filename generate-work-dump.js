const fs = require("fs");
const path = require("path");

const dumpFolder = path.join(__dirname, "assets", "work-dump");
const outputFile = path.join(__dirname, "work-dump-data.js");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function encodePathSegment(segment) {
  return encodeURIComponent(segment).replace(/'/g, "%27");
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

if (!fs.existsSync(dumpFolder)) {
  console.error("Map niet gevonden:", dumpFolder);
  process.exit(1);
}

const files = fs
  .readdirSync(dumpFolder)
  .filter((file) => {
    const extension = path.extname(file).toLowerCase();
    return allowedExtensions.includes(extension);
  })
  .sort(naturalSort);

const images = files.map((file, index) => {
  return {
    src: `assets/work-dump/${encodePathSegment(file)}`,
    alt: `Work Dump image ${index + 1}`,
    layout: `dump-layout-${(index % 8) + 1}`
  };
});

const output = `window.workDumpImages = ${JSON.stringify(images, null, 2)};\n`;

fs.writeFileSync(outputFile, output);

console.log(`Work Dump data gemaakt met ${images.length} beelden.`);
console.log("Bestand:", outputFile);