var _ = require('underscore');
var CONFIG = require('fs').existsSync('app.config.json') ? require('./app.config.json') : null;

CONFIG = _.assign({
  i18n: {
    langs: ['en', 'ru'],
    defaultLang: 'en',
  },
  proxies: []
}, CONFIG ? CONFIG.Config : {});

/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  AppConfig: CONFIG,

  langs: CONFIG.i18n.langs,
  defaultLang: CONFIG.i18n.defaultLang,

  /**
   * The port for connect http server
   */
  connect_port: 8080,

  connect_proxies: CONFIG.proxies,

  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',
  source_dir: 'ngapp',

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/canvas-to-blob/js/canvas-to-blob.min.js',
      'vendor/underscore/underscore-min.js',
      'vendor/jquery/dist/jquery.js',

      'vendor/angular/angular.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.min.js',
      'vendor/angular-loading-bar/build/loading-bar.min.js',
      'vendor/angular-translate/angular-translate.min.js',
      'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'vendor/angular-ui-notification/dist/angular-ui-notification.min.js',
      'vendor/angular-file-upload/dist/angular-file-upload.min.js',
      'vendor/restangular/dist/restangular.min.js',
      'vendor/ng-dialog/js/ngDialog.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/bootstrap/js/transition.js',
      //'vendor/bootstrap/js/alert.js',
      //'vendor/bootstrap/js/button.js',
      //'vendor/bootstrap/js/carousel.js',
      'vendor/bootstrap/js/collapse.js',
      //'vendor/bootstrap/js/dropdown.js',
      //'vendor/bootstrap/js/modal.js',
      //'vendor/bootstrap/js/tooltip.js',
      //'vendor/bootstrap/js/popover.js',
      //'vendor/bootstrap/js/scrollspy.js',
      //'vendor/bootstrap/js/tab.js',
      //'vendor/bootstrap/js/affix.js',
    ],
    assets: [
      'vendor/bootstrap/fonts/*',
    ]
  },

  /**
   * Rules for mockup
   */
  mockup_rules: require('./api'),

  /**
   * Rewrite rules
   */
  rewrite_rules: [
    '^/(assets|vendor|ngapp)/(.*)$ /$1/$2 [L]',
    '^.+$ /index.html',
  ]
};
