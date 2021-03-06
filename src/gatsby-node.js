"use strict";

const fetchSheet = require(`./fetch-sheet.js`).default;
const _ = require("lodash");
const crypto = require("crypto");
const seedConstant = "2972963f-2fcf-4567-9237-c09a2b436541";

exports.sourceNodes = async (
  { boundActionCreators, getNode, store, cache },
  { spreadsheetId, worksheetTitle, credentials }
) => {
  const { createNode, setPluginStatus } = boundActionCreators;
  console.log("FETCHING SHEET", fetchSheet);
  let rows = await fetchSheet(spreadsheetId, worksheetTitle, credentials);

  rows.forEach(r => {
    createNode(
      Object.assign(r, {
        id:
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15),
        parent: "__SOURCE__",
        children: [],
        internal: {
          type: _.camelCase(`googleSheetRows`),
          contentDigest: crypto
            .createHash("md5")
            .update(JSON.stringify(r))
            .digest("hex")
        }
      })
    );
  });
};
