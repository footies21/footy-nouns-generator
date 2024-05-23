const fs = require('fs');
const { getRandomItemFromArray } = require('../utils');
const { baseImages } = require('../baseImages');

function getRandomNoun(id) {
  const perKit = 15;
  const parts = {
    background: getRandomItemFromArray(baseImages.background),
    // background: baseImages.background[1],
    kit: baseImages.kit[3],
    // kit: baseImages.kit[Math.floor(id / perKit)],
    // kit: getRandomItemFromArray(baseImages.kit),
    // kit for match up
    // kit: baseImages.kit[id % 2 === 0 ? 40 : 16],
    head: getRandomItemFromArray(baseImages.head),
    // head: baseImages.head[2],
    // glasses: baseImages.glasses[14],
    glasses: getRandomItemFromArray(baseImages.glasses),
  };

  return {
    parts,
    id,
    tokenId: id,
  };
}

function generateData(outputFolder, amount) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const nounsArray = [];

  for (var i = 0; i < amount; i++) {
    const noun = getRandomNoun(i);
    nounsArray.push(noun);
  }

  fs.writeFileSync(
    `${outputFolder}/data.json`,
    JSON.stringify(nounsArray, null, 2),
  );
}

module.exports = {
  generateData,
};
