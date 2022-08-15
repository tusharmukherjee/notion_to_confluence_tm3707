const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const showdown = require("showdown");
const cors = require("cors");

const fs = require("fs");
const fetch = require("node-fetch");

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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get("/", async (req, res) => {
//   const data = await notion.blocks.children.list({
//     block_id: "adcf998109ac4aa1ab14ca7cf048b743",
//   });
//   //   await notion.pages.
//   //   console.log(data);
//   res.send(data);
// });

// [x] Edit Request ----------------------------------------------------------

app.post("/pagetoedit", async (req, res) => {
  const pageID = req.body.pageID;
  console.log(pageID);

  const title = await fetch(`https://api.notion.com/v1/pages/${pageID}`, {
    headers: {
      "Notion-Version": "2021-08-16",
      Authorization: "Bearer " + auth,
    },
  }).then((res) => res.json());

  const pagePropKeys = Object.keys(title.properties);

  const head = title.properties[pagePropKeys[pagePropKeys.length - 1]].title
    .length
    ? `${
        title.properties[pagePropKeys[pagePropKeys.length - 1]].title[0]
          .plain_text
      }`
    : "no title";

  const mdblocks = await n2m.pageToMarkdown(pageID);
  const mdString = n2m.toMarkdownString(mdblocks);

  const html = converter.makeHtml(mdString);

  const editData = {
    head,
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

app.post("/edit-to-conv", async (req, res) => {
  const datatoC = req.body;
  console.log(datatoC.conHTML);

  const bodyData = `{
    'title': '${datatoC.head}',
    'type': "page",
    'space': {
      'key': "TUSHARSSPA"
    },
    'body': {
      'storage': {
        'value': '${datatoC.conHTML}',
        'representation': "wiki",
      },
    },
  }`;
  console.log(bodyData);

  await fetch("https://tusharmukherjee.atlassian.net/wiki/rest/api/content", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer q5gjYaw8onArGEAqly0r',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData,
  }).then((response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    res.send(response);
  });
});

// [x] Get All Database ---------------------------------------------------

app.get("/getdatabase", async (req, res) => {
  const databases = await fetch("https://api.notion.com/v1/databases", {
    headers: {
      Authorization: "Bearer " + auth,
      "Notion-Version": "2021-08-16",
    },
  }).then((res) => res.json());

  // console.log(databases);

  const databasesArr = await databases.results.map((el) => {
    const databaseObj = {
      id: el.id,
      title: el.title[0].plain_text,
    };
    return databaseObj;
  });

  res.send(databasesArr);
});

// [x] GET page id from a particular database --------------------------------

app.post("/getpages", async (req, res) => {
  const pages_from_a_DB = await fetch(
    `https://api.notion.com/v1/databases/${req.body.databaseID}/query`,
    {
      method: "POST",
      headers: {
        "Notion-Version": "2022-06-28",
        Authorization: "Bearer " + auth,
      },
    }
  ).then((res) => res.json());
  // console.log(pages_from_a_DB);
  const page_Meta_Data = await Promise.all(
    pages_from_a_DB.results.map(async (el) => {
      const metaPageRes = await fetch(
        `https://api.notion.com/v1/pages/${el.id}`,
        {
          headers: {
            "Notion-Version": "2021-08-16",
            Authorization: "Bearer " + auth,
          },
        }
      ).then((res) => res.json());
      console.log(metaPageRes);

      const pagePropKeys = Object.keys(metaPageRes.properties);

      const metaData = {
        id: `${metaPageRes.id}`,
        icon:
          metaPageRes.icon !== null
            ? `${metaPageRes.icon.emoji}`
            : `${metaPageRes.icon}`,
        url: `${metaPageRes.url}`,
        title: metaPageRes.properties[pagePropKeys[pagePropKeys.length - 1]]
          .title.length
          ? `${
              metaPageRes.properties[pagePropKeys[pagePropKeys.length - 1]]
                .title[0].plain_text
            }`
          : "no title",
        content: metaPageRes.properties[pagePropKeys[pagePropKeys.length - 2]]
          .rich_text.length
          ? `${
              metaPageRes.properties[pagePropKeys[pagePropKeys.length - 2]]
                .rich_text[0].plain_text
            }`
          : "no desc.",
      };

      return metaData;
    })
  );

  res.send({ pages_from_a_DB: page_Meta_Data });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
