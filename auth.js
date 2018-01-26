import appInit from 'util/appInit'

var orgSlug = /\/reports\/(.*)/.exec(window.location)
const startApp = () => require('./app').default()
appInit(orgSlug, startApp, 'Reporting', true /* temp until olark is gone */)
