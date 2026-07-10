const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

let sharp;

try {
  sharp = require("sharp");
} catch (error) {
  console.error("Sharp is niet geïnstalleerd.");
  console.error("Run eerst: npm install -D sharp");
  process.exit(1);
}

const ROOT = __dirname;
const studioDumpDir = path.join(ROOT, "assets", "studio-dump");
const thumbDir = path.join(studioDumpDir, "thumbs");
const fullDir = path.join(studioDumpDir, "full");
const outputFile = path.join(ROOT, "studio-dump-data.js");

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const ignoredDirs = new Set(["thumbs", "full"]);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/\\/g, "/")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "image";
}

function shortHash(value) {
  return crypto.createHash("md5").update(value).digest("hex").slice(0, 8);
}

function toUrl(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  let results = [];

  if (!fs.existsSync(dir)) {
    console.error(`Map niet gevonden: ${dir}`);
    process.exit(1);
  }

  const items = await fsp.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.name.startsWith(".")) continue;

    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      if (ignoredDirs.has(item.name)) continue;
      results = results.concat(await walk(fullPath));
      continue;
    }

    const ext = path.extname(item.name).toLowerCase();

    if (allowedExtensions.has(ext)) {
      results.push(fullPath);
    }
  }

  return results;
}

async function pruneGeneratedFolder(dir, keepSet) {
  if (!fs.existsSync(dir)) return;

  const items = await fsp.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    if (path.extname(item).toLowerCase() !== ".webp") continue;

    if (!keepSet.has(path.resolve(fullPath))) {
      await fsp.unlink(fullPath);
    }
  }
}

async function processImage(sourcePath, slug) {
  const thumbPath = path.join(thumbDir, `${slug}.webp`);
  const fullPath = path.join(fullDir, `${slug}.webp`);

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 700,
      height: 700,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({
      quality: 76,
      effort: 6
    })
    .toFile(thumbPath);

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({
      quality: 82,
      effort: 6
    })
    .toFile(fullPath);

  const thumbMeta = await sharp(thumbPath).metadata();

  return {
    thumb: toUrl(thumbPath),
    full: toUrl(fullPath),
    width: thumbMeta.width,
    height: thumbMeta.height
  };
}

async function main() {
  await ensureDir(thumbDir);
  await ensureDir(fullDir);

  const sourceImages = await walk(studioDumpDir);

  const sortedImages = sourceImages.sort((a, b) => {
    const relA = path.relative(studioDumpDir, a);
    const relB = path.relative(studioDumpDir, b);
    return relB.localeCompare(relA);
  });

  const usedSlugs = new Set();
  const keepThumbs = new Set();
  const keepFull = new Set();
  const imageData = [];

  for (const sourcePath of sortedImages) {
    const relativeSourcePath = path.relative(studioDumpDir, sourcePath);
    let slug = slugify(relativeSourcePath);

    if (usedSlugs.has(slug)) {
      slug = `${slug}-${shortHash(relativeSourcePath)}`;
    }

    usedSlugs.add(slug);

    console.log(`Verwerk: ${relativeSourcePath}`);

    const item = await processImage(sourcePath, slug);

    imageData.push(item);
    keepThumbs.add(path.resolve(path.join(thumbDir, `${slug}.webp`)));
    keepFull.add(path.resolve(path.join(fullDir, `${slug}.webp`)));
  }

  await pruneGeneratedFolder(thumbDir, keepThumbs);
  await pruneGeneratedFolder(fullDir, keepFull);

  const output = `const STUDIO_DUMP_IMAGES = ${JSON.stringify(imageData, null, 2)};
`;

  await fsp.writeFile(outputFile, output);

  console.log("");
  console.log(`Studio Dump bijgewerkt.`);
  console.log(`${imageData.length} beelden gevonden.`);
  console.log(`Thumbnails: ${toUrl(thumbDir)}`);
  console.log(`Full size: ${toUrl(fullDir)}`);
  console.log(`Datafile: ${toUrl(outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});