'use strict';

import { render } from 'react-dom';
import routes from 'lib/routes';
import 'config';

import 'react-select/dist/react-select.css';

render(routes, document.getElementById('app-root'));
