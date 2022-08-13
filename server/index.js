const { Client } = require("@notionhq/client");
const express = require("express");
const app = express();
const port = 3001;

app.get("/", async (req, res) => {
  const data = await notion.blocks.children.list({
    block_id: "adcf998109ac4aa1ab14ca7cf048b743",
  });
  //   await notion.pages.
  //   console.log(data);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const notion = new Client({
  auth: "secret_2eNsh5j4Fz2dnAqTyh1kaKS5KbeFCINdw8cfUgkDqCs",
});
