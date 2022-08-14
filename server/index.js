const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const showdown = require("showdown");
const cors = require("cors");

const fs = require("fs");

const express = require("express");
const app = express();
const port = 3001;

const auth = "secret_2eNsh5j4Fz2dnAqTyh1kaKS5KbeFCINdw8cfUgkDqCs";

const notion = new Client({
  auth,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const converter = new showdown.Converter({ tables: true });

const corsOption = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));

// app.get("/", async (req, res) => {
//   const data = await notion.blocks.children.list({
//     block_id: "adcf998109ac4aa1ab14ca7cf048b743",
//   });
//   //   await notion.pages.
//   //   console.log(data);
//   res.send(data);
// });

// Edit Request ----------------------------------------------------------

app.get("/pagetoedit", async (req, res) => {
  const pageID = req.body.pageID;

  const title = await fetch(`https://api.notion.com/v1/pages/${pageID}`).then(
    (res) => res.json()
  );

  const mdblocks = await n2m.pageToMarkdown(pageID);
  const mdString = n2m.toMarkdownString(mdblocks);

  const html = converter.makeHtml(mdString);

  const editData = {
    title,
    html,
  };

  fs.writeFile("test.md", html, (err) => {
    console.log(err);
  });

  res.send(editData);
});

// Convert Request --------------------------------------------------------

app.post("/pagetoconvert", async (req, res) => {
  const pageID = req.body.pageID;

  const title = await fetch(`https://api.notion.com/v1/pages/${pageID}`).then(
    (res) => res.json()
  );

  const mdblocks = await n2m.pageToMarkdown(pageID);
  const mdString = n2m.toMarkdownString(mdblocks);
  const html = converter.makeHtml(mdString);
  const titleObj = title.properties.length - 1;

  const bodyData = {
    title: `${titleObj.title[0].plain_text}`,
    type: "page",
    space: "tushars_space",
    body: {
      storage: {
        value: `${html}`,
        representation: "wiki",
      },
    },
  };

  await fetch("https://tusharmukherjee.atlassian.net/wiki/rest/api/content", {
    method: "POST",
    headers: {
      Authorization: "Bearer q5gjYaw8onArGEAqly0r",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: bodyData,
  }).then((response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    res.send(response);
    console.log(response);
    return response.text();
  });
});

//  Get All Database ---------------------------------------------------

app.get("/getdatabase", async (req, res) => {
  const databases = await fetch("https://api.notion.com/v1/databases", {
    headers: {
      Authorization: "Basic " + `${auth}`,
      "Notion-Version": "2021-08-16",
    },
  });

  const databasesArr = databases.map((el) => {
    const databaseObj = {
      id: el.id,
      title: el.title[0].plain_text,
    };
    return databaseObj;
  });

  res.send(databasesArr);
});

// GET page id from a particular database --------------------------------

app.get("/getpages", async (req, res) => {
  const pages_from_a_DB = await fetch(
    `https://api.notion.com/v1/databases/${req.body.databaseID}/query`
  );
  const page_Meta_Data = await pages_from_a_DB.results.map(async (el) => {
    const metaPageRes = await fetch(
      `https://api.notion.com/v1/pages/${el.id}`
    ).then((res) => res.json());

    const pagePropKeys = Object.keys(metaPageRes.properties);

    const metaData = {
      id: `${metaPageRes.id}`,
      icon: `${metaPageRes.icon}`,
      url: `${metaPageRes.url}`,
      title: `${
        metaPageRes.properties[pagePropKeys[pagePropKeys.length - 1]].title
          .plain_text
      }`,
      content: `${
        metaPageRes.properties[pagePropKeys[pagePropKeys.length - 2]].title
          .plain_text
      }`,
    };

    return metaData;
  });

  res.send(page_Meta_Data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
