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
     ${cyan} Pass an image URL or local path to generate a blurhash, width, and height

     ${red} Usage 
        $ npx blurhash-cli <url>

     ${red} Example
        $ npx blurhash-cli https://i.imgur.com/NhfEdg2.png

     ${red} Example with size
        $ npx blurhash-cli https://i.imgur.com/NhfEdg2.png --size=64

     ${red} Example with local image
        $ npx blurhash-cli ./my-image.png --local

     ${red} Options
        --size=<size>  Set the size of the blurhash (default: 32)
        --local, -l  Use a local image instead of URL
        --help, -h  Show the help menu for the command
        --version, -v  Show the current version of the package
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
      local: {
        type: "boolean",
        alias: "l",
        default: false,
      },
    },
  }
);

const getCLIUrl = cli.input[0];
let getSize = parseInt(cli.flags.size);

if (getSize <= 0 || isNaN(getSize)) {
  console.log(red, "Invalid size specified. Using the default size of 32.");
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
      offline: cli.flags.local,
    });

    spinner.stop();
    spinner.succeed("🥳 Blurhash Generated");
    console.log(cyan, "Hash:", blurhash.encoded);
    console.log(red, "Width:", blurhash.width);
    console.log(green, "Height:", blurhash.height);
  } catch (error) {
    spinner.fail(`${red} ${error}`);
  }
}

blurhashCLI();
