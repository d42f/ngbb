angular.module('ngApp.services.underscore', [])

.factory('_', function ($window) {
    return $window._;
})

;
