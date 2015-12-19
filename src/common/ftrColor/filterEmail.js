angular.module('ngApp.filters.color', [])

.filter('color', function (CONST) {
  var colors = CONST.colors;
  return function (value) {
    for (var i = colors.length; i-- > 0;) {
      if (colors[i].value === value) {
        return colors[i].title;
      }
    }
    return value;
  };
});
