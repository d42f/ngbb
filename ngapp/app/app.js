if (!String.format) {
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
}

angular.module('ngApp', [
  /* 3rd party */
  'pascalprecht.translate',
  'ui.router',
  'ui-notification',
  'restangular',
  'angularFileUpload',
  'ngDialog',
  'cfp.loadingBar',
  /* components */
  'ngApp.config',
  'ngApp.values.Commmon',
  'ngApp.filters.bytes',
  'ngApp.filters.trustsrc',
  'ngApp.services.underscore',
  'ngApp.services.Text',
  'ngApp.services.Modal',
  'ngApp.services.LocalStorage',
  'ngApp.services.UserSession',
  'ngApp.directives.lkLoad',
  'ngApp.directives.lkPassword',
  'ngApp.directives.lkBlobAsImg',
  'ngApp.directives.lkHideimg404',
  'ngApp.directives.lkInputFocus',
  'ngApp.directives.lkInputNumber',
  'ngApp.directives.lkIcon',
  'ngApp.directives.lkPagination',
  'ngApp.directives.lkUserChannels',
  /* states */
  'ngApp.states.error',
  'ngApp.states.signup',
  'ngApp.states.signin',
  'ngApp.states.signout',
  'ngApp.states.reset',
  'ngApp.states.index',
  'ngApp.states.favorites',
  'ngApp.states.channels',
  'ngApp.states.channel',
  /* templates */
  'templates-components',
  'templates-app'
])

.constant('Const', {
  pageTitle: 'ngbb example app',
  authState: 'signin',
  indexState: 'index',
  defaultLangKey: 'en',
  defaultDeviceTimezone: 'Europe/London',
  colors: [
    {value: 'red', title: /*i18nextract*/'Red'},
    {value: 'white', title: /*i18nextract*/'White'},
    {value: 'black', title: /*i18nextract*/'Black'},
    {value: 'blue', title: /*i18nextract*/'Blue'},
    {value: 'yellow', title: /*i18nextract*/'Yellow'},
    {value: 'green', title: /*i18nextract*/'Green'}
  ]
})

.config(function appConfig (Const, Config, $stateProvider, $httpProvider, $translateProvider, $locationProvider, $urlRouterProvider, NotificationProvider, cfpLoadingBarProvider, ngDialogProvider) {
  for (var key in Config) {
    if (Config.hasOwnProperty(key)) {
      if (typeof Config[key] === 'string' && Config[key].substring(0, 2) === '//') {
        Config[key] = window.location.protocol + Config[key];
      }
    }
  }

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common = {'Content-Type': 'application/json;charset=utf-8'};
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.headers.get = {'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT'};
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  $httpProvider.interceptors.push('UserSession');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/translations/',
    suffix: '.json'
  });
  $translateProvider.useSanitizeValueStrategy(null);

  $urlRouterProvider.otherwise(Const.indexState);

  NotificationProvider.setOptions({
    delay: 8000
  });

  cfpLoadingBarProvider.includeSpinner = false;

  ngDialogProvider.setDefaults({
    closeByNavigation: true,
    closeByDocument: false,
    disableAnimation: false,
    overlay: false
  });

  $stateProvider.state('base', {
    abstract: true,
    resolve: {
      CurrentUser: function ($q, UserSession) {
        var user = UserSession.user;
        if (!user.userId) {
          return undefined;
        }
        return $q.resolve({userId: 1}).then(function (rsp) {
          return UserSession.set(rsp);
        }, function () {
          UserSession.reset();
        });
      },
      CurrentLanguage: function (Const, Comm, $translate, LocalStorage, CurrentUser) {
        var langKey = LocalStorage.val('langKey') || (CurrentUser ? CurrentUser.language : null) || Const.defaultLangKey,
            findKey = false;
        for (var i = Comm.languages.length; i-- > 0;) {
          if (Comm.languages[i].value === langKey) {
            findKey = true;
          }
        }
        if (!findKey) {
          langKey = Const.defaultLangKey;
        }
        return $translate.use(langKey).then(function () {
          LocalStorage.val('langKey', langKey);
          angular.element('body').removeAttr('ng-translate-cloak');
          return {};
        });
      }
    }
  });

  $stateProvider.state('public', {
    abstract: true,
    parent: 'base',
    views: {
      'layout@': {
        templateUrl: 'layouts/public.tpl.html'
      }
    }
  });

  $stateProvider.state('private', {
    abstract: true,
    parent: 'base',
    views: {
      'layout@': {
        templateUrl: 'layouts/private.tpl.html'
      }
    },
    resolve: {
      Session: function (UserSession, CurrentUser, CurrentLanguage) {
        var user = UserSession.user;
        if (!user.userId) {
          return UserSession.reset();
        }
      }
    }
  });
})

.run(function appRun ($rootScope, Const, Config, $state, $filter, Restangular, LocalStorage, UserSession) {
  Restangular.setBaseUrl(Config.api);
  Restangular.withConfig = (function (fn) {
    var withConfig = Restangular.withConfig;
    return function (fn) {
      var restangular = withConfig.call(Restangular, fn);
      return restangular;
    };
  })();

  angular.extend(angular, {
    app: {
      Config: Config,
      getSession: function () {
        return UserSession.user;
      },
      setSession: function (user) {
        return UserSession.set(user);
      },
      resetSession: function () {
        UserSession.reset();
      },
      translate: (function () {
        var translate = $filter('translate');
        return function (key) {
          return translate.apply(null, arguments) || key;
        };
      })(),
      values: function (o, keys) {
        var res = {};
        for (var i = keys.length; i-- > 0;) {
          var key = keys[i];
          if (o.hasOwnProperty(key)) {
            res[key] = o[key];
          }
        }
        return res;
      },
      num: function (val) {
        return isFinite(+val) ? +val : val;
      },
      url: function (val) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(val);
      },
      email: function (val) {
        return /.+@.+\..+/.test(val);
      },
      arrClrAdd: function (arr, newItems) {
        Array.prototype.splice.apply(arr, [0, arr.length].concat(newItems || []));
      },
      getHost: function (url) {
        if (url.indexOf('//') === -1) {
          return '';
        }
        url = url.substring(url.indexOf('//') + 2);
        return url.substring(0, Math.min(url.indexOf(':'), url.indexOf('/')));
      },
      fixApiUrl: function (url) {
        var apiDomain = angular.look.getHost(Config.api),
            urlDomain = angular.look.getHost(url);
        if (urlDomain === 'localhost') {
          url = url.replace(urlDomain, apiDomain);
        }
        return url;
      },
      submitForm: function (method, url, data) {
        var frm = document.createElement('form'),
            style = 'width:0;height:0;line-height:0;overflow:hidden;position:absolute;left:-9000px;top:-9000px';
        frm.setAttribute('baseURI', url);
        frm.setAttribute('action', url);
        frm.setAttribute('method', method);
        frm.setAttribute('style', style);
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var input = document.createElement('input');
            input.setAttribute('name', key);
            input.setAttribute('type', 'hidden');
            input.setAttribute('value', data[key]);
            frm.appendChild(input);
          }
        }
        document.body.appendChild(frm);
        frm.submit();
      }
    }
  });

  angular.extend($rootScope, {
    Const: Const,
    Storage: LocalStorage.storage,
    $$apply: function () {
      if (!this.$$phase) {
        this.$apply();
      }
    },
    filter: function (query) {
      $state.go('.', {query: query ? query : null}); 
    }
  });
})

.controller('AppCtrl', function AppCtrl ($rootScope, Const, $location, $translate, cfpLoadingBar, Notification, LocalStorage, UserSession) {
  $rootScope.$on('UserSession.reset', function (evt) {
    Notification.clearAll();
    LocalStorage.reset(['langKey']);
  });

  $rootScope.$on('$stateChangeStart', UserSession.check);

  $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
    $rootScope.pageTitle = Const.pageTitle;
    if (angular.isDefined(toState.data.pageTitle)) {
      $translate(toState.data.pageTitle).then(function (translation) {
        $rootScope.pageTitle += ' - ' + translation;
      }, function (translation) {
        $rootScope.pageTitle += ' - ' + translation;
      });
    }

    $rootScope.htmlClassname = toState.data.htmlClassname || '';
    $rootScope.bodyClassname = toState.data.bodyClassname || '';
  });

  $rootScope.$on('$stateChangeStart', cfpLoadingBar.start);
  $rootScope.$on('$stateChangeSuccess', cfpLoadingBar.complete);
  $rootScope.$on('$stateChangeError', cfpLoadingBar.complete);

  $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
    if ($location.$$host === 'localhost') {
      console.log('$stateChangeError', evt, fromState, toState, error);
    }
  });
})

;

