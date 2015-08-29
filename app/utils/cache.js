var cache = {};

var ensureTokenKey = (token) => {
  if (!cache[token])
    cache[token] = {};
};

export var set = (token, key, data) => {
  ensureTokenKey(token);
  cache[token][key] = data;
};

export var get = (token, key) => {
  ensureTokenKey(token);
  return cache[token][key];
};

export var clean = (token) => {
  var data = cache[token];
  delete cache[token];
  return data;
};

export var expire = (token, key) => {
  ensureTokenKey(token);
  delete cache[token][key];
};

