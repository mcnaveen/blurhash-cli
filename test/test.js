import test from "ava";
import { execa } from "execa";

test("https://i.imgur.com/NhfEdg2.png", async (t) => {
  await execa("node", ["cli.js", "https://i.imgur.com/NhfEdg2.png"]);
  t.pass();
});

test("./image/cover.png --size=64 --local", async (t) => {
  await execa("node", ["cli.js", "./image/cover.png", "--size=64", "--local"]);
  t.pass();
});
