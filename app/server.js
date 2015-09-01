import http from 'http';
import fs from 'fs';
import React from 'react';
import Router from 'react-router';
import uuid from 'uuid';
import cache from './utils/cache';
import getRoutes from './routes.js';
import fetchData from './utils/fetchData';
import write from './utils/write';
import Cookies from 'cookies';


const indexHTML = fs.readFileSync(__dirname+'/index.html').toString();
const mainJS = fs.readFileSync(__dirname+'/../public/js/main.js');
const styles = fs.readFileSync(__dirname+'/assets/styles.css');


const renderApp = (req, token, cb) => {
  const path = req.url;
  const htmlRegex = /¡HTML!/;
  const dataRegex = /¡DATA!/;

  const router = Router.create({
    routes: getRoutes(token),
    location: path,
    onAbort: (redirect) => {
      cb({redirect});
    },
    onError: (err) => {
      console.log('Routing Error');
      console.log(err);
    }
  });

  router.run((Handler, state) => {
    if (state.routes[0].name === 'not-found') {
      let html = React.renderToStaticMarkup(<Handler/>);
      cb({notFound: true}, html);
      return;
    }
    fetchData(token, state).then((data) => {
      let clientHandoff = { token, data: cache.clean(token) };
      let html = React.renderToString(<Handler data={data} />);
      let output = indexHTML.
         replace(htmlRegex, html).
         replace(dataRegex, JSON.stringify(clientHandoff));
      cb(null, output, token);
    });
  });
};

const app = http.createServer((req, res) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token') || uuid();
  cookies.set('token', token, { maxAge: 30 * 24 * 60 * 60 });

  switch (req.url) {
  case '/js/main.js':
    return write(mainJS, 'text/javascript', res);
  case '/favicon.ico':
    return write('haha', 'text/plain', res);
  case '/styles.css':
    return write(styles, 'text/css', res);
  default:
    renderApp(req, token, (error, html) => {
      if (!error) {
        write(html, 'text/html', res);
      } else if (error.redirect) {
        res.writeHead(303, { 'Location': error.redirect.to });
        res.end();
      } else if (error.notFound) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
      }
    });
  }
});

app.listen(process.env.PORT || 5000);

