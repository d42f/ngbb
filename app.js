var CONFIG = require('./build.config.js');
var utils = require('./build.utils.js');
var argv = require('optimist').argv;

require('gulp-connect').server({
  port: process.env.PORT || CONFIG.connect_port,
  root: process.env.DEV || argv.dev ? CONFIG.build_dir : CONFIG.compile_dir,
  debug: false,
  livereload: false,
  routes: CONFIG.mockup_rules,
  rules: CONFIG.rewrite_rules,
  middleware: utils.connectMiddleware
});
