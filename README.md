### Development

```
npm install
npm start
Open http://localhost:5001
```

### Deploy
`npm run build`, then deploy `/dist` folder


### TODO

* save button to save presets
* dropdown of saved presets
* live-edit and update preset
* new preset
* collapsible panes
* whenever server returns error 403 we should redirect to login page
* we need common way to display errors — inline or via some kind of messaging, like this: http://igorprado.com/react-notification-system/
* unauthenticated user should get no layout

### TODO later
* using google font from web, not good, we need to use local one
* lots of stylesheet files, already minified — not good, we need them unminified and managed by webpack
* images should also be managed by webpack, not sure how at this point
* use browserHistory for react-router, but server must support it
* Implement logout: clear localstorage

### NOTES

* would be nice to get all attributes and presets preloaded for product search page (Issue #1)
* it would be good to have an endpoint to refresh the token by sending valid one, so that user won't have to login http://stackoverflow.com/a/26834685/1657839.