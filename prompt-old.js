const readline = require('readline');
const { baseImages } = require('./scripts/baseImages');
const { printImages } = require('./scripts/printImages');
const fs = require('fs');
// const { getRandomItemFromArray } = require('./scripts/utils');

// Define the option sets
const kitOptions = baseImages.kit;
const headOptions = baseImages.head;
const glassesOptions = baseImages.glasses;

// Define the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define the function to prompt the user and handle their selection for a single option set
function promptOptionSet(optionSet, optionSetName, answerObject) {
  rl.question(
    `Select an option for ${optionSetName} (${optionSet.join(
      ', \n',
    )}, or "random"): `,
    (answer) => {
      // Determine which option the user selected
      let selection;
      if (answer.toLowerCase() === 'random') {
        // Randomly select an option
        selection = optionSet[Math.floor(Math.random() * optionSet.length)];
        console.log(
          `Randomly selected option for ${optionSetName}: ${selection}`,
        );
      } else {
        // Use the user's input to select an option from the array
        const matchingOptions = optionSet.filter((option) =>
          option.toLowerCase().includes(answer.toLowerCase()),
        );
        if (matchingOptions.length === 0) {
          console.log(
            `No matching options found for ${optionSetName}: ${answer}`,
          );
        } else if (matchingOptions.length === 1) {
          // If there's only one matching option, select it
          selection = matchingOptions[0];
          console.log(`Selected option for ${optionSetName}: ${selection}`);
        } else {
          // If there are multiple matching options, prompt the user to select one
          rl.question(
            `Multiple matching options found for ${optionSetName} (${matchingOptions.join(
              ', ',
            )}), select one: `,
            (answer) => {
              const index = parseInt(answer) - 1;
              if (
                isNaN(index) ||
                index < 0 ||
                index >= matchingOptions.length
              ) {
                console.log(
                  `Invalid selection for ${optionSetName}: ${answer}`,
                );
                rl.close();
              } else {
                selection = matchingOptions[index];
                console.log(
                  `Selected option for ${optionSetName}: ${selection}`,
                );
              }
            },
          );
          return;
        }
      }
      // Prompt the user for the next option set
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
          // console.log({ ...answerObject, glasses: selection });
          rl.close();
          // print

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
          // print

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

          // end print
          break;
      }
    },
  );
}

// Prompt the user for the first option set
promptOptionSet(kitOptions, 'kit', {});
