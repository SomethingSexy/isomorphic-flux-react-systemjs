var cache = {};

var ensureTokenKey = (token) => {
  if (!cache[token])
    cache[token] = {};
};

export default {
  set: (token, key, data) => {
    ensureTokenKey(token);
    cache[token][key] = data;
  },
  get: (token, key) => {
    ensureTokenKey(token);
    return cache[token][key];
  },
  clean: (token) => {
    var data = cache[token];
    delete cache[token];
    return data;
  },
  expire: (token, key) => {
    ensureTokenKey(token);
    delete cache[token][key];
  }
};
