angular.module('ngApp.services.localStorage', [])

.factory('localStorage', function ($window) {
  var STORAGEKEY = 'SWTEST',
      storageContainer = $window['localStorage'] || {},
      storage, service;

  try {
    storage = angular.fromJson(storageContainer[STORAGEKEY]) || {};
  } catch (err) {
    storage = {};
  }

  service = {
    get: function (key) {
      return storage[key];
    },
    set: function (key, value) {
      storage[key] = value;
      storageContainer[STORAGEKEY] = angular.toJson(storage);
      return service;
    }
  };

  return {
    storage: storage,
    val: function (key, value) {
      return arguments.length === 1 ? service.get(key) : service.set(key, value);
    }
  };
})

;
