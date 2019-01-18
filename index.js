const axios = require("axios");
const schedule = require("node-schedule");
const zip = require("./zip");

const env = require("./env");
const fetchEvents = require("./fetchEvents");
const fetchSlackIdsMap = require("./fetchSlackIdsMap");

const {
  members,
  slack: { webhook }
} = env;

const pad0 = x => (x.toString().length === 1 ? "0" + x : x);

const formatDate = target => {
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  const date = target.getDate();
  const hours = pad0(target.getHours());
  const minutes = pad0(target.getMinutes());

  return `${year}/${month}/${date} ${hours}:${minutes} (GMT+8)`;
};

const beforeTenMinutes = date => {
  const timestamp = date.getTime();

  return new Date(timestamp - 600000);
};

const main = async () => {
  const idsMap = await fetchSlackIdsMap();
  const eventsMap = new Map();

  zip(members, await Promise.all(members.map(fetchEvents))).forEach(
    ([member, events]) => {
      events
        .filter(({ hangoutLink }) => Boolean(hangoutLink))
        .forEach(event => {
          const { id, summary, hangoutLink } = event;
          const start = new Date(event.start.dateTime || event.start.date);

          let nextEvent = eventsMap.get(id);
          nextEvent = Boolean(nextEvent)
            ? {
                ...nextEvent,
                attendees: [...nextEvent.attendees, member]
              }
            : {
                start,
                summary,
                hangoutLink,
                attendees: [member]
              };

          eventsMap.set(id, nextEvent);
        });
    }
  );

  Array.from(eventsMap)
    .filter(([_, event]) => event.attendees.length > 1)
    .forEach(([_, event]) => {
      const { summary, attendees, start, hangoutLink } = event;
      const startMessage = formatDate(start);
      const attendeesMessage = attendees
        .filter(email => idsMap.has(email))
        .map(email => "<@" + idsMap.get(email) + ">")
        .join(" / ");

      const data = {
        attachments: [
          {
            color: "#6DC1C1",
            text: "咩！稍後有一場 meetup 即將舉行！",
            fields: [
              {
                title: "主題",
                value: summary
              },
              {
                title: "對象",
                value: attendeesMessage
              },
              {
                title: "時間",
                value: startMessage
              }
            ],
            actions: [
              {
                type: "button",
                text: "進入會議廳",
                url: hangoutLink,
                style: "primary"
              }
            ]
          }
        ]
      };

      schedule.scheduleJob(beforeTenMinutes(start), () =>
        axios.post(webhook, data)
      );
    });
};

main();

schedule.scheduleJob({ hour: 0, minute: 0, second: 0 }, () => main());
