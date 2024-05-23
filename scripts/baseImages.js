const fs = require('fs');

const baseImages = {
  background: [],
  kit: [],
  head: [],
  commonHead: [],
  rareHead: [],
  legendaryHead: [],
};

function getFileNames() {
  const backgroundsBasePath = './base-images/backgrounds';
  const kitsBasePath = './base-images/kits-2';
  const headsBasePath = './base-images/heads';
  const commmonHeadsBasePath = './base-images/heads-common';
  const rareHeadsBasePath = './base-images/heads-rare';
  const legendaryHeadsBasePath = './base-images/heads-legendary';
  const glassesBasePath = './base-images/glasses';

  // Load backgrounds
  const backgrounds = fs.readdirSync(backgroundsBasePath);
  baseImages.background = backgrounds.map((i) => `${backgroundsBasePath}/${i}`);

  // Load kits
  const kits = fs.readdirSync(kitsBasePath);
  baseImages.kit = kits.map((i) => `${kitsBasePath}/${i}`);

  // Load heads
  const heads = fs.readdirSync(headsBasePath);
  baseImages.head = heads.map((i) => `${headsBasePath}/${i}`);

  const commonHeads = fs.readdirSync(commmonHeadsBasePath);
  baseImages.commonHead = commonHeads.map(
    (i) => `${commmonHeadsBasePath}/${i}`,
  );

  const rareHeads = fs.readdirSync(rareHeadsBasePath);
  baseImages.rareHead = rareHeads.map((i) => `${rareHeadsBasePath}/${i}`);

  const legendaryHeads = fs.readdirSync(legendaryHeadsBasePath);
  baseImages.legendaryHead = legendaryHeads.map(
    (i) => `${legendaryHeadsBasePath}/${i}`,
  );

  // Load glasses
  const glasses = fs.readdirSync(glassesBasePath);
  baseImages.glasses = glasses.map((i) => `${glassesBasePath}/${i}`);
}

getFileNames();

module.exports = {
  baseImages,
};
