'use strict';

import { render } from 'react-dom';
import routes from 'lib/routes';
import 'config';

render(routes, document.getElementById('app-root'));
