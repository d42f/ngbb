angular.module('ngApp.states.channel', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('channel', {
    parent: 'private',
    url: '/channel/:id',
    auth: true,
    views: {
      'page@private': {
        controller: 'ChannelCtrl',
        templateUrl: 'channel/channel.tpl.html'
      }
    },
    resolve: {
      //
    },
    data: {
      pageTitle: /*i18nextract*/'Channel',
      className: ''
    }
  });
})

.controller('ChannelCtrl', function ChannelCtrl ($scope) {
  angular.extend($scope, {
    //
  });
})

;
