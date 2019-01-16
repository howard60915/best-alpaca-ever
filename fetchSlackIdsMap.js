const axios = require("axios");

const env = require("./env");

const {
  slack: { token }
} = env;

const fetchSlackIdsMap = async () => {
  const {
    data: { members }
  } = await axios.get("https://slack.com/api/users.list", {
    params: { token }
  });

  return new Map(
    members
      .filter(member => {
        const { deleted, profile } = member;
        const { email } = profile;

        return !deleted && email;
      })
      .map(member => {
        const { id, profile } = member;
        const { email } = profile;

        return [email, id];
      })
  );
};

module.exports = fetchSlackIdsMap;
