'use strict';

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from 'views/layout/layout';
import ProductSearch from 'views/products/search';
import Login from 'views/users/login';
import Notfound from 'views/errors/not_found';
import auth from 'lib/auth';

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

const routes =
	<Router history={ hashHistory }>
		<Route path='/' component={ Layout }>
			<IndexRoute component={ ProductSearch } onEnter={ requireAuth } />
			<Route path="login" component={ Login } />
			<Route path="*" component={ Notfound } />
		</Route>
	</Router>

export default routes