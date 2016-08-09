angular.module('ngApp.filters.trustsrc', [])

.filter('trustsrc', function ($sce) {
  var resources = {};
  return function () {
    var res = [];
    for (var i = 0, n = arguments.length; i < n; i++) {
      res.push(i === 0 ? arguments[i] : encodeURIComponent(arguments[i]));
    }
    res = res.join('');
    if (!resources[res]) {
      resources[res] = $sce.trustAsResourceUrl(res);
    }
    return resources[res];
  };
})

;
