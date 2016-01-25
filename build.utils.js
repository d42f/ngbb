parse = require('url').parse;
var pathToRegexp = require('path-to-regexp');

module.exports = {
  routesMiddleware: (function () {
    var routes = [];

    function match (path, route) {
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
    };

    return function (connect, opt) {
      var middleware = [];

      if (Array.isArray(opt.routes)) {
        for (var i = 0, n = opt.routes.length; i < n; i++) {
          if (!opt.routes[i].path) {
            continue;
          }
          var route = {
            keys: [],
            params: [],
            path: opt.routes[i].path,
            method: (opt.routes[i].method || 'GET').toUpperCase(),
            callback: opt.routes[i].callback || function () {}
          };
          route.regexp = pathToRegexp(route.path, route.keys);
          routes.push(route);
        }
        middleware.push(function (req, res, next) {
          for (var i = 0, n = opt.routes.length; i < n; i++) {
            if (req.method === routes[i].method && match(parse(req.url).pathname || req.url, routes[i])) {
              if (typeof routes[i].callback !== 'function') {
                throw new Error('Failed to call rule callback "' + routes[i].method + ' ' + routes[i].path + '"');
              }
              routes[i].callback.apply(null, [req, res]);
              break;
            }
          }

          return res.finished ? undefined : next();
        });
      }

      return middleware;
    };
  })()
};
