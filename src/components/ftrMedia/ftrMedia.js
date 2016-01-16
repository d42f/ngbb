angular.module('ngApp.filters.media', [])

.filter('media', function (_) {
  return function (items, filter) {
    return _.filter(items, function (o) {
      var isValid = true;
      for (var key in filter) {
        if (filter.hasOwnProperty(key)) {
          switch (key) {
            case 'stk':
              if (filter.stk && filter.stk !== o.InStock) {
                isValid = false;
              }
              break;
            case 'clr':
              if (filter.clr && filter.clr !== o.Color) {
                isValid = false;
              }
              break;
            case 'dt_fm':
              if (filter.dt_fm && filter.dt_fm.getTime() >= o.IssueDate) {
                isValid = false;
              }
              break;
            case 'dt_to':
              if (filter.dt_to && filter.dt_to.getTime() <= o.IssueDate) {
                isValid = false;
              }
              break;
            case 'ps_fm':
              if (typeof filter.ps_fm === 'number' && filter.ps_fm >= o.Price) {
                isValid = false;
              }
              break;
            case 'ps_to':
              if (typeof filter.ps_to === 'number' && filter.ps_to <= o.Price) {
                isValid = false;
              }
              break;
          }
          if (!isValid) {
            break;
          }
        }
      }
      return isValid;
    });
  };
});
