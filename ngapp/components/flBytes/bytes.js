angular.module('ngApp.filters.bytes', [])

.filter('bytes', function ($filter, $text) {
  var cachedValues = {};
  return function filterBytes (bytes, precision, unit, noneunit) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
      return '-';
    }
    if (typeof precision === 'undefined') {
      precision = 1;
    }

    var cachedValuesKey = String(bytes);
    cachedValuesKey = bytes > 1000 ? cachedValuesKey.substring(0, cachedValuesKey.length - 2) + '00' : cachedValuesKey;
    cachedValuesKey += '-' + String(precision);
    if (unit) {
      cachedValuesKey += '-' + String(unit);
    }
    if (noneunit) {
      cachedValuesKey += '-noneunit'; 
    }
    if (!cachedValues.hasOwnProperty(cachedValuesKey)) {
      var val = 0,
          units = [$text('bytes'), $text('KB'), $text('MB'), $text('GB'), $text('TB'), $text('PB')],
          number = bytes ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;

      if (unit) {
        number = ({'KB': 1, 'MB': 2, 'GB': 3})[unit] || number;
      }

      for (; (val = (bytes / Math.pow(1024, Math.floor(number)))) * 10 < 1 && number;) {
        if (unit) {
          break;
        }
        number--;
      }

      if (number === 0) {
        precision = 0;
      }

      cachedValues[cachedValuesKey] = val.toFixed(precision) + (noneunit ? '' : ' ' + units[number]);
    }

    return cachedValues[cachedValuesKey];
  };
});
