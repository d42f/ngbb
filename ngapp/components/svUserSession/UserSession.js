angular.module('ngApp.services.UserSession', [])

.factory('UserSession', function ($rootScope, $injector, $q, LocalStorage) {
  var service = {
    opts: {
      userIdKey: 'userId',
      authstate: 'signin',
      errorstate: 'error'
    },
    user: LocalStorage.val('CurrentUser') || {},
    isAuth: function () {
      return !!service.user[service.opts.userIdKey];
    },
    set: function (user) {
      angular.extend(service.user, user);
      LocalStorage.val('CurrentUser', service.user);
      $rootScope.$broadcast('UserSession.set');
      return service.user;
    },
    reset: function () {
      for (var key in service.user) {
        if (service.user.hasOwnProperty(key)) {
          delete service.user[key];
        }
      }
      LocalStorage.val('CurrentUser', service.user);
      $rootScope.$broadcast('UserSession.reset');
      return service.user;
    },
    goToAuth: (function () {
      var $state;
      return function () {
        $state = $state || $injector.get('$state');
        return $state.go(service.opts.authstate);
      };
    })(),
    goToError: (function () {
      var $state;
      return function () {
        $state = $state || $injector.get('$state');
        return $state.go(service.opts.errorstate);
      };
    })(),
    check: function (evt, toState, toParams) {
      if (toState.auth && !service.isAuth()) {
        evt.preventDefault();
        service.goToAuth();
      }
    },
    responseError: function (rsp) {
      switch (rsp.status) {
        case -1:
        case 0:
          //service.reset();
          //service.goToError();
          break;
        case 401:
          service.reset();
          service.goToAuth();
          break;
        case 403:
          if (angular.look.isNotEnoughMoney(rsp)) {
            $rootScope.$broadcast('UserSession.tariff.NOTENOUGHMONEY');
          }
          break;
      }
      return $q.reject(rsp);
    }
  };

  return service;
})

;
