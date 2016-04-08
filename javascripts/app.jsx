'use strict';

import { render } from 'react-dom';
import Routes from 'lib/routes';
import 'config';

import 'react-select/dist/react-select.css';

render(Routes, document.getElementById('app-root'));
