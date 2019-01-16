const env = {};

["credentials", "members", "slack", "tokens"].forEach(key => {
  env[key] = JSON.parse(process.env[key]);
});

module.exports = env;
