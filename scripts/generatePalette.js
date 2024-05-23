const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const { baseImages } = require('./baseImages');
const ethers = require('ethers');
var rgb2hex = require('rgb2hex');

function isPixelDifferent(a, b) {
  const totalDifferenceR = Math.abs(a[0] - b[0]);
  const totalDifferenceG = Math.abs(a[1] - b[1]);
  const totalDifferenceB = Math.abs(a[2] - b[2]);
  const totalDifferenceA = Math.abs(a[3] - b[3]);

  return (
    totalDifferenceR > 1 ||
    totalDifferenceB > 1 ||
    totalDifferenceG > 1 ||
    totalDifferenceA > 1
  );
}

// Keep a key of all the colors
const accumulatedColors = [];

// Global palette
const palette = {};

function getHex(pixel) {
  return rgb2hex(
    `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] === 255 ? 1 : 0})`,
  ).hex.toUpperCase();
}

async function extractColors(imagePath) {
  const width = 32;
  const height = 32;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const image = await loadImage(imagePath);
  context.drawImage(image, 0, 0, width, height);

  const pixels = [];

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      const p = context.getImageData(x, y, 1, 1).data;
      // Reduce similar colors
      const existingSimilar = accumulatedColors.find(
        (i) => !isPixelDifferent(i, p),
      );

      if (existingSimilar) {
        pixels.push(getHex(existingSimilar));
      } else {
        pixels.push(getHex(p));
        accumulatedColors.push(p);
      }
    }
  }
  return pixels;
}

function getRLEEncodedData(pixels) {
  console.log(pixels);
  const rleEncodedData = [];
  let runLength = 0;
  let currentColorIndex = 0;
  for (var i = 0; i < pixels.length; i++) {
    const colorIndex = palette[pixels[i]] || 0;

    if (colorIndex != currentColorIndex || runLength == 255) {
      rleEncodedData.push(runLength);
      rleEncodedData.push(currentColorIndex);
      runLength = 0;
      currentColorIndex = colorIndex;
    }
    runLength++;
  }

  console.log(rleEncodedData);

  return ethers.utils.hexlify(rleEncodedData);
}

async function generate() {
  const headImages = await Promise.all(
    baseImages.head.map(async (f) => {
      return extractColors(f);
    }),
  );

  const commonHeadImages = await Promise.all(
    baseImages.commonHead.map(async (f) => {
      return extractColors(f);
    }),
  );

  const rareHeadImages = await Promise.all(
    baseImages.rareHead.map(async (f) => {
      return extractColors(f);
    }),
  );

  const legendaryHeadImages = await Promise.all(
    baseImages.legendaryHead.map(async (f) => {
      return extractColors(f);
    }),
  );

  const kitImages = await Promise.all(
    baseImages.kit.map(async (f) => {
      return extractColors(f);
    }),
  );

  const glassesImages = await Promise.all(
    baseImages.glasses.map(async (f) => {
      return extractColors(f);
    }),
  );

  // Generate rgba palette
  let acc = 1;
  accumulatedColors.forEach((p) => {
    const hex = getHex(p);
    if (!palette[hex]) {
      palette[hex] = acc;
      acc += 1;
    }
  });

  // Unique palette
  fs.writeFileSync('./palette.json', JSON.stringify(palette, null, 2));

  // Now we have a global palette and the arrays of pixels, time to generate the length encoded
  const headRLE = headImages.map(getRLEEncodedData);
  const commonHeadRLE = commonHeadImages.map(getRLEEncodedData);
  const rareHeadRLE = rareHeadImages.map(getRLEEncodedData);
  const legendaryHeadRLE = legendaryHeadImages.map(getRLEEncodedData);
  // .map((val) => `bytes(hex"${val}")`);
  const kitRLE = kitImages.map(getRLEEncodedData);
  // .map((val) => `bytes(hex"${val}")`);
  const glassesRLE = glassesImages.map(getRLEEncodedData);
  // .map((val) => `bytes(hex"${val}")`);

  const paletteArray = Object.keys(palette);

  fs.writeFileSync(
    './output.json',
    JSON.stringify(
      {
        palette,
        paletteArray: paletteArray,
        heads: headRLE,
        commonHeads: commonHeadRLE,
        rareHeads: rareHeadRLE,
        legendaryHeads: legendaryHeadRLE,
        kits: kitRLE,
        glasses: glassesRLE,
      },
      null,
      2,
    ),
  );
}

generate();

// console.log(
//   ethers.utils.toUtf8String(
//     '0x0000ff01ff01ab010e2512010e2512010a250126011402251201092501260114020301251201022501010625012601140203012512010225010107250126011402251201022501010b251201022501010b251201022501010b251201022501010b251201022501010b25',
//   ),
// );
