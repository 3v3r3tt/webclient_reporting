window.jQuery = require('jquery') // 1000 monkeys

var request = new XMLHttpRequest()
var orgSlug = /\/reports\/(.*)/.exec(window.location)

class VOError extends Error {
  constructor (message) {
    super(message)

    this.name = 'VOError'
    this.message = message

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

function sendError (message) {
  if (window.Raygun) {
    try {
      throw new VOError(message)
    } catch (err) {
      window.Raygun.send(err)
    }
  }
}

function apiPrefix (orgSlug) {
  /* eslint-disable */
  if (orgSlug) {
    const org = orgSlug[1];
    return '/api/' + org.replace(/[#\/].*/, '')
  } else {
    goToAuth()
    return false;
  }
  /* eslint-enable */
}

function goToAuth () {
  window.location = '/auth'
}

function getLoginOptsAndRedirect () {
    // use auth discovery endpoint
  var req2 = new XMLHttpRequest()
  const apiRoutePrefix = apiPrefix(orgSlug)

  if (apiRoutePrefix) { goToAuth() }

  req2.open('GET', apiRoutePrefix + '/login_options')
  req2.setRequestHeader('Accept', 'application/json')
  req2.onload = function () {
    try {
      if (req2.status >= 200 && req2.status < 300) {
        var resp = JSON.parse(req2.responseText)
        var isSSO = resp.login_options.filter((opt) => opt.name === 'sso')
        var isPwd = resp.login_options.filter((opt) => opt.name === 'passwd')
        if (isSSO.length > 0) {
          window.location = isSSO[0].url
        } else if (isPwd.length > 0) {
          window.location = isPwd[0].url
        } else {
          goToAuth()
        }
      } else {
        goToAuth()
      }
    } catch (e) {
      goToAuth()
    }
  }
  req2.send()
}

request.open('GET', apiPrefix(orgSlug) + '/config.json', true)
request.setRequestHeader('Accept', 'application/json')

request.onload = function () {
  if (request.status >= 200 && request.status < 300) {
    window.VO_CONFIG = JSON.parse(request.responseText)
    document.getElementsByTagName('title')[0].text = 'Timeline - ' + window.VO_CONFIG.orgname
    require('./app').default()
  } else if (request.status >= 400 && request.status < 500) {
    getLoginOptsAndRedirect()
  } else {
    // TODO: think about other failures - need landing pages for all of them
    sendError(`VO_CONFIG:${request.status}`)
  }
}

request.onerror = function () {
  sendError('VO_CONFIG:onerror')
}

request.send()
