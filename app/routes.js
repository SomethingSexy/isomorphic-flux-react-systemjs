import React from 'react';
import { DefaultRoute, Route, NotFoundRoute } from 'react-router';

export default (token) => {

  // hand-wavy dependency injection
  var CreateContact = require('./handlers/CreateContact');
  CreateContact.token = token;

  return [
    <Route name="root" path="/" handler={require('./handlers/Root')}>
      <DefaultRoute handler={require('./handlers/Home')} />
      <Route name="contact" path="contact/:id" handler={require('./handlers/Contact')} />
      <Route name="newContact" handler={require('./handlers/NewContact')} />
      <Route name="createContact" handler={CreateContact} />
    </Route>,
    <NotFoundRoute name="not-found" handler={require('./handlers/NotFound')}/>
  ];
};

