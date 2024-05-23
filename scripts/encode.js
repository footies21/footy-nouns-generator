const { PNGCollectionEncoder } = require('@nouns/sdk');
const { readPngFile } = require('node-libpng');

const fs = require('fs')
const path = require('path')
const { baseImages } = require('./baseImages')

const DESTINATION = path.join(__dirname, '../output/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();


  await Promise.all(baseImages.head.map(async f => {
    const image = await readPngFile(f);
    encoder.encodeImage(f.replace(/\.png$/, '').split('/').pop(), image, 'head');
  }))

  await Promise.all(baseImages.kit.map(async f => {
    const image = await readPngFile(f);
    encoder.encodeImage(f.replace(/\.png$/, '').split('/').pop(), image, 'kit');
  }))

  await Promise.all(baseImages.background.map(async f => {
    const image = await readPngFile(f);
    encoder.encodeImage(f.replace(/\.png$/, '').split('/').pop(), image, 'background');
  }))

  fs.writeFileSync(
    DESTINATION,
    JSON.stringify(
      {
        bgcolors: ['d5d7e1', 'e1d7d5'],
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

encode();