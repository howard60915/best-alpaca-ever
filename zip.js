const zip = (xs, ys) => {
  const result = [];
  const length = xs.length < ys.length ? xs.length : ys.length;

  for (let i = 0; i < length; i++) {
    result[i] = [xs[i], ys[i]];
  }

  return result;
};

module.exports = zip;
