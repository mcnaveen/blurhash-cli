import test from "ava";
import { execa } from "execa";

test("https://i.imgur.com/NhfEdg2.png", async (t) => {
  await execa("node", ["cli.js", "https://i.imgur.com/NhfEdg2.png"]);
  t.pass();
});
