angular.module('ngApp.services.Modal', [])

.factory('Modal', function (ngDialog) {
  return {
    confirm: function (opts) {
      return ngDialog.openConfirm({
        templateUrl: 'svModal/Modal.confirm.tpl.html',
        controller: 'ModalConfirmCtrl',
        resolve: {
          opts: function () {
            return opts || {};
          }
        }
      });
    }
  };
})

.controller('ModalConfirmCtrl', function ModalConfirmCtrl ($scope, ngDialog, opts) {
  angular.extend($scope, {
    opts: opts,
    state: {
      //
    }
  });

  $scope.ok = function () {
    return $scope.confirm();
  };

  $scope.cancel = function () {
    return $scope.closeThisDialog();
  };
})

;
