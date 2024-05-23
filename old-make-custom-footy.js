const readline = require('readline');
const { baseImages } = require('./scripts/baseImages');
const { printImages } = require('./scripts/printImages');
const fs = require('fs');

const kitOptions = baseImages.kit;
const headOptions = baseImages.head;
const glassesOptions = baseImages.glasses;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptOptionSet(optionSet, optionSetName, answerObject) {
  console.log(`Select an option for ${optionSetName}:`);
  for (let i = 0; i < optionSet.length; i++) {
    console.log(`[${i + 1}] ${optionSet[i]}`);
  }
  console.log(`[0] Random`);
  rl.question(`Enter your choice: `, (answer) => {
    let selection;
    if (answer === '' || answer === '0') {
      selection = optionSet[Math.floor(Math.random() * optionSet.length)];
      console.log(
        `Randomly selected option for ${optionSetName}: ${selection}`,
      );
    } else {
      const index = parseInt(answer) - 1;
      if (isNaN(index) || index < 0 || index >= optionSet.length) {
        console.log(`Invalid selection for ${optionSetName}: ${answer}`);
      } else {
        selection = optionSet[index];
        console.log(`Selected option for ${optionSetName}: ${selection}`);
      }
    }
    switch (optionSetName) {
      case 'kit':
        promptOptionSet(headOptions, 'head', {
          ...answerObject,
          kit: selection,
        });
        break;
      case 'head':
        promptOptionSet(glassesOptions, 'glasses', {
          ...answerObject,
          head: selection,
        });
        break;
      case 'glasses':
        rl.close();
        const parts = {
          ...answerObject,
          head: answerObject.head,
          background: baseImages.background[0],
          glasses: selection,
        };
        const footy1 = { parts, id: 0, tokenId: 0 };
        const footy2 = {
          parts: {
            ...parts,
            background: baseImages.background[1],
          },
          id: 1,
          tokenId: 1,
        };

        const printedVersion = Date.now();
        const outputFolder = `./output/${printedVersion}`;

        if (!fs.existsSync(`./output`)) {
          fs.mkdirSync(`./output`);
        }

        if (!fs.existsSync(`${outputFolder}`)) {
          fs.mkdirSync(`${outputFolder}`);
        }

        const nounsArray = [footy1, footy2];

        fs.writeFileSync(
          `${outputFolder}/data.json`,
          JSON.stringify(nounsArray, null, 2),
        );

        printImages(outputFolder);
        break;
    }
  });
}

promptOptionSet(kitOptions, 'kit', {});
