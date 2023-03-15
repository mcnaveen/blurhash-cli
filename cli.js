#!/usr/bin/env node

import { blurhashFromURL } from "blurhash-from-url";
import updateNotifier from "update-notifier";

import packageJson from "./package.json" assert { type: "json" };

import chalk from "chalk";
import ora from "ora";
import meow from "meow";

const spinner = ora();
const cyan = chalk.cyan.bold("›");
const red = chalk.red.bold("›");
const green = chalk.green.bold("›");
const yellow = chalk.yellow.bold("›");

const notifier = updateNotifier({ pkg: packageJson });

notifier.notify();

const cli = meow(
  `
     ${cyan} Pass a image url to generate a blurhash, width and height

     ${red} Usage 
        $ blurhash-cli <url>

     ${red} Example
        $ blurhash-cli https://i.imgur.com/NhfEdg2.png

     ${red} Example with size
        $ blurhash-cli https://i.imgur.com/NhfEdg2.png --size=64

     ${red} Options
        --size=<size>  Set the size of the blurhash (default: 32)
        --help, -h  Show help menu for command
        --version, -v  Show current version of package
      `,
  {
    importMeta: import.meta,
    flags: {
      help: {
        type: "boolean",
        alias: "h",
      },
      version: {
        type: "boolean",
        alias: "v",
      },
      size: {
        type: "string",
        alias: "s",
        default: "32",
      },
    },
  }
);

const getCLIUrl = cli.input[0];
// get size from cli -s or --size flag
const getSize = parseInt(cli.flags.size);

// check if getSize is a valid positive integer
if (getSize <= 0 || isNaN(getSize)) {
  console.log(red, "Invalid size specified. Using default size of 32.");
  getSize = 32;
}

if (!getCLIUrl) {
  cli.showHelp();
}

async function blurhashCLI() {
  spinner.start();
  try {
    spinner.text = "Generating Blurhash...";
    const blurhash = await blurhashFromURL(getCLIUrl, {
      size: getSize || 32,
    });
    spinner.stop();
    spinner.succeed(`🥳 Blurhash Generated`);
    console.log(cyan, "Hash:", blurhash.encoded);
    console.log(red, "Width:", blurhash.width);
    console.log(green, "Height:", blurhash.height);
  } catch (error) {
    spinner.fail(`${red} ${error}`);
  }
}

blurhashCLI();
