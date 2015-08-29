import when = require('when');
import axios = require('axios');
import cache = require('./cache');

const Promise = when.Promise;

var HOST = 'http://addressbook-api.herokuapp.com';
//var HOST = 'http://localhost:5001';

export var get = (url, token) => {
  var cached = cache.get(token, url);
  return (cached) ?
    Promise.resolve(cached) :
    axios({
      url: HOST+url,
      headers: { 'Authorization': token }
    }).then(function(res) {
      cache.set(token, url, res.data);
      return res.data;
    });
};

export var post = (url, data, token) => {
  return axios({
    method: 'post',
    data: data,
    url: HOST+url,
    headers: { 'Authorization': token }
  }).then(function(res) {
    return res.data;
  });
};

