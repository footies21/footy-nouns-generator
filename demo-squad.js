const fs = require('fs');

const { generateData } = require('./scripts/demo/generateData');
const { printSquadImages } = require('./scripts/printImages');
// const { generateGif } = require('./scripts/generateGif');

const printedVersion = Date.now();
const outputFolder = `./output/${printedVersion}`;

if (!fs.existsSync(`./output`)) {
  fs.mkdirSync(`./output`);
}

if (!fs.existsSync(`${outputFolder}`)) {
  fs.mkdirSync(`${outputFolder}`);
}

// if (!fs.existsSync(`./output/onChain`)) {
//   fs.mkdirSync(`./output/onChain`);
// }

generateData(outputFolder, 750);
if (true) {
  printSquadImages(outputFolder).then(() => {
    // generateGif(outputFolder, 30);
  });
}
