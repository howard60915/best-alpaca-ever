const fs = require("fs");

const credentials = require("../config/credentials.json");
const members = require("../config/members.json");
const slack = require("../config/slack.json");
const tokens = require("../config/tokens.json");

const yaml =
  "apiVersion: v1\n" +
  "kind: ConfigMap\n" +
  "metadata:\n" +
  "  name: best-alpaca-ever\n" +
  "data:\n" +
  `  credentials: '${JSON.stringify(credentials)}'\n` +
  `  members: '${JSON.stringify(members)}'\n` +
  `  slack: '${JSON.stringify(slack)}'\n` +
  `  tokens: '${JSON.stringify(tokens)}'`;

fs.writeFileSync("./k8s/configMap.yaml", yaml);
