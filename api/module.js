String.prototype.format = function () {
  var str = this, pos, cnd, ind, cnds = str.match(/{(\d+)}/g) || [], cndsInd = cnds.length;
  while (cndsInd--) {
    pos = -1;
    cnd = cnds[cndsInd];
    ind = cnd.replace(/[{}]+/g, '');
    str = str.split(cnd).join(String(arguments[+ind]) || '');
  }
  return str.toString();
};

function rndvl (max) {
  return Math.floor(Math.random() * max);
}

function rndel (a) {
  return a[Math.floor(Math.random() * a.length)];
}

module.exports = [
  {
    method: 'post',
    path: '/users',
    response: {
      userId: 1
    }
  },
  {
    method: 'post',
    path: '/users/confirmation',
    response: {}
  },
  {
    method: 'post',
    path: '/users/login',
    response: function (req, res) {
      var body = '';
      req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
          req.connection.destroy();
        }
      }).on('end', function () {
        var params = {}, rsp = {error: 'Unauthorized'};
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        try {
          params = JSON.parse(body);
        } catch (err) {}
        if (params.password == '123123') {
          res.statusCode = 200;
          rsp = {userId: 1};
        }
        res.end(JSON.stringify(rsp));
      });
    }
  },
  {
    method: 'post',
    path: '/users/:id/logout',
    response: {}
  },
  {
    method: 'get',
    path: '/users/:id',
    response: {
      userId: 1,
      phone: 1234567890
    }
  }
];
