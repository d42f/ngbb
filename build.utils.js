var parse = require('url').parse;
var pathToRegexp = require('path-to-regexp');

var utils = {
  makeRoute: function (o) {
    var route = {
      keys: [],
      params: [],
      path: o.path,
      method: (o.method || 'GET').toUpperCase(),
      callback: o.callback || function () {}
    };
    route.regexp = pathToRegexp(route.path, route.keys);
    return route;
  },
  routeMatch: function (path, route) {
    var keys = route.keys,
        params = route.params = [],
        m = route.regexp.exec(path);

    if (!m) {
      return false;
    }

    for (var i = 1, len = m.length; i < len; i++) {
      var key = keys[i - 1];

      try {
        var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
      } catch (err) {
        err = new Error('Failed to decode param "' + m[i] + '"');
        err.status = 400;
        throw err;
      }

      if (key) {
        params[key.name] = val;
      } else {
        params.push(val);
      }
    }

    return true;
  },
  routesMiddleware: function (req, res, next) {
    var routes = this.routes;
    for (var i = 0, n = routes.length; i < n; i++) {
      if (req.method === routes[i].method && utils.routeMatch(parse(req.url).pathname || req.url, routes[i])) {
        if (typeof routes[i].callback !== 'function') {
          throw new Error('Failed to call rule callback "' + routes[i].method + ' ' + routes[i].path + '"');
        }
        routes[i].callback.apply(null, [req, res]);
        break;
      }
    }

    return res.finished ? undefined : next();
  },
  connectMiddleware: function (connect, opt) {
    var middleware = [];

    if (Array.isArray(opt.routes) && opt.routes.length) {
      var routes = [];
      for (var i = 0, n = opt.routes.length; i < n; i++) {
        routes.push(utils.makeRoute(opt.routes[i]));
      }
      middleware.push(utils.routesMiddleware.bind({routes: routes}));
    }

    return middleware;
  }
};

module.exports = utils;
