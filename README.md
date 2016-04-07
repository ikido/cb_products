### Development

```
npm install
npm start
Open http://localhost:5001
```


### Deploy
`npm run build`, then deploy `/dist` folder


### TODO

* whenever server returns error 403 we should redirect to login page
* above columns search box for attribute types to add them to the list
* save button to save presets
* dropdown of saved presets
* live-edit and update preset
* new preset
* collapsible panes
* we need common way to display errors — inline or via some kind of messaging, like this: http://igorprado.com/react-notification-system/
* unauthenticated user should get no layout


### TODO later

* using google font from web, not good, we need to use local one

* lots of stylesheet files, already minified — not good, we need them unminified and managed by webpack

* images should also be managed by webpack, not sure how at this point

* use browserHistory for react-router, but server must support it

* we have login, what about logout?


### NOTES

* would be nice to get all attributes and presets preloaded for product search page

* it's bad that after unsuccessfull login we still get HTTP 200 page

* it would be good to have an endpoint to refresh the token by sending valid one, so that user won't have to login http://stackoverflow.com/a/26834685/1657839. 

* in the docs you say header should be Authentication but it should be Authorization: `Bearer