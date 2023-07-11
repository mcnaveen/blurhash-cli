import test from "ava";
import { execa } from "execa";

test("Blurhash generation from URL", async (t) => {
  await execa("node", ["cli.js", "https://i.imgur.com/NhfEdg2.png"]);
  t.pass();
});

test("Blurhash generation from local image", async (t) => {
  await execa("node", ["cli.js", "./image/cover.png", "--size=64", "--local"]);
  t.pass();
});
