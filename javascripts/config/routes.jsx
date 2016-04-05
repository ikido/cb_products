import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from 'views/layout/layout';
import ProductSearch from 'views/products/search';
import Notfound from 'views/errors/not_found';

const routes =
	<Router history={ hashHistory }>
  	<Route path='/' component={ Layout }>
			<IndexRoute component={ ProductSearch } />
	  	<Route path="*" component={ Notfound } />
	  </Route>
  </Router>

export default routes