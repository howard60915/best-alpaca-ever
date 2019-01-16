const { google } = require("googleapis");

const env = require("./env");

const { credentials, tokens } = env;
const { client_id, client_secret } = credentials.installed;

const auth = new google.auth.OAuth2(client_id, client_secret);
auth.setCredentials(tokens);

const withToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const startTime = new Date(year, month, date);
  const endTime = new Date(startTime.getTime() + 86399999);

  return {
    timeMin: now.toISOString(),
    timeMax: endTime.toISOString()
  };
};

const fetchEvents = async (calendarId = "primary") => {
  const calendar = google.calendar({ version: "v3", auth });
  const params = {
    calendarId,
    singleEvents: true,
    orderBy: "startTime",
    ...withToday()
  };

  const { data } = await calendar.events.list(params);

  return data.items;
};

module.exports = fetchEvents;
