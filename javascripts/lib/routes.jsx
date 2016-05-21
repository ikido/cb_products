'use strict';

import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from 'views/layout/layout';
import ProductSearch from 'views/products/search';
import Login from 'views/users/login';
import Notfound from 'views/errors/not_found';
import Auth from 'lib/auth';

const requireAuth = (nextState, replace) => {
	// console.log(nextState.location.pathname)
	const pathName = nextState.location.pathname === '/' ? '/product-search' : nextState.location.pathname

  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: pathName }
    });
  }
}

const routes =
	<Router history={ hashHistory }>
		<Route path='/login' component={ Login } />
		<Route path='/' component={ Layout } onEnter={ requireAuth }>
			<Route path="product-search" component={ ProductSearch } />
			<Route path="*" component={ Notfound } />
		</Route>
		
	</Router>

export default routes