const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const credentials = require("./config/credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES
});

console.log("Authorize this app by visiting this url:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = async () => {
  const code = await new Promise(resolve =>
    rl.question("Enter the code from that page here: ", resolve)
  );
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync("./tokens.json", JSON.stringify(tokens));

  return console.log("Generate token successfully");
};

main();
