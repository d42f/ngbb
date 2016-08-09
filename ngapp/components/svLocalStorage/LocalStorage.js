angular.module('ngApp.services.LocalStorage', [])

.factory('LocalStorage', function ($window) {
  var STORAGEKEY = 'LKCLIENT',
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
    },
    reset: function (ignoredKeys) {
      var ignoredKeysHash = {};
      for (var i = (ignoredKeys || []).length; i-- > 0;) {
        ignoredKeysHash[ignoredKeys[i]] = true;
      }
      for (var key in storage) {
        if (storage.hasOwnProperty(key) && !ignoredKeysHash.hasOwnProperty(key)) {
          delete storage[key];
        }
      }
      storageContainer[STORAGEKEY] = angular.toJson(storage);
    }
  };

  return {
    storage: storage,
    val: function (key, value) {
      return arguments.length === 1 ? service.get(key) : service.set(key, value);
    },
    reset: service.reset
  };
})

;
