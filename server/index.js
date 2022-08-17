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


// [x] Edit Request ----------------------------------------------------------

app.post("/pagetoedit", async (req, res) => {
  const pageID = req.body.pageID;
  // console.log(pageID);

  const mdblocks = await n2m.pageToMarkdown(pageID);
  const mdString = n2m.toMarkdownString(mdblocks);

  const html = converter.makeHtml(mdString);

  const editData = {
    html,
  };

  res.send(editData);
});

//[x] Convert Request --------------------------------------------------------

app.post("/direct-convert", async (req, res) => {
  const pageID = req.body;

  const mdblocks = await n2m.pageToMarkdown(pageID.pageID);
  const mdString = n2m.toMarkdownString(mdblocks);
  const html = converter.makeHtml(mdString);
  // console.log(html)
  // res.send({html:html});

  const bodyData = {
    title: `${pageID.title}`,
    type: "page",
    space: {
      key: "TUSHARSSPA"
    },
    body: {
      storage: {
        value: `${html}`,
        representation: "storage"
      }
    }
}
  // console.log(bodyData);

  await fetch("https://tusharmukherjee.atlassian.net/wiki/rest/api/content", {
    method: "POST",
    headers: {
      'Authorization': 'Basic dHVzaGFyMTIxNG1ydEBnbWFpbC5jb206WEtwazVvZTJ0dmp4QWxxZ09OS3BGRjg0',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData),
  })
  .then((response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    res.sendStatus(response.status);
  });
});


// [x] Edited, now convert

app.post("/edit-to-conv", async (req, res) => {
  const datatoC = req.body;
  // console.log(datatoC.conHTML);

  const bodyData = {
    title: `${datatoC.head}`,
    type: "page",
    space: {
      key: "TUSHARSSPA"
    },
    body: {
      storage: {
        value: `${datatoC.conHTML}`,
        representation: "storage"
      }
    }
}
  // console.log(bodyData);

  await fetch("https://tusharmukherjee.atlassian.net/wiki/rest/api/content", {
    method: "POST",
    headers: {
      'Authorization': 'Basic dHVzaGFyMTIxNG1ydEBnbWFpbC5jb206WEtwazVvZTJ0dmp4QWxxZ09OS3BGRjg0',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData),
  })
  .then((response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    res.sendStatus(response.status);
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


// [x] SEARCH DOC -------------------------------------------------------------------

app.post("/search", async (req,res)=>{

  try{
    const pageID = req.body.pageID;

  const metaPageRes = await fetch(
    `https://api.notion.com/v1/pages/${pageID}`,
    {
      headers: {
        "Notion-Version": "2021-08-16",
        Authorization: "Bearer " + auth,
      },
    }
  ).then((res) => res.json());
  
  // console.log(metaPageRes,"mP");

      

    
    if(metaPageRes.status == 400){
      throw metaPageRes;
    }
    else{

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

      // console.log(metaData,"search");
      res.send({"metaData":metaData});
    }
  }
  catch(err){
    // console.log(err,"err");
    res.sendStatus(err.status);
    // res.send(err);
  }

  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
