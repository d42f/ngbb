var karma = require('karma');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var html2js = require('gulp-html2js');
var connect = require('gulp-connect');

var CONFIG = require('./build.config.js');
var utils = require('./build.utils.js');

function swallowError (err) {
  console.log(err.toString());
  gutil.beep();
  this.emit('end');
}

gulp.task('bump', function () {
  return gulp.src(['bower.json', 'package.json'])
    .pipe(require('gulp-bump')())
    .pipe(gulp.dest('.'));
});

gulp.task('bump.minor', function () {
  return gulp.src(['bower.json', 'package.json'])
    .pipe(require('gulp-bump')({type: 'minor'}))
    .pipe(gulp.dest('.'));
});

gulp.task('bump.major', function () {
  return gulp.src(['bower.json', 'package.json'])
    .pipe(require('gulp-bump')({type: 'major'}))
    .pipe(gulp.dest('.'));
});

gulp.task('connect.build', function () {
  return connect.server({
    port: CONFIG.connect_port,
    root: CONFIG.build_dir,
    livereload: true,
    routes: CONFIG.mockup_rules,
    middleware: utils.connectMiddleware
  });
});

gulp.task('connect.compile', function () {
  return connect.server({
    port: CONFIG.connect_port,
    root: CONFIG.compile_dir,
    livereload: false,
    routes: CONFIG.mockup_rules,
    middleware: utils.connectMiddleware
  });
});

gulp.task('clean', function () {
  return gulp.src([CONFIG.compile_dir, CONFIG.build_dir], {read: false})
    .pipe(require('gulp-clean')());
});

gulp.task('assets.vendor', function () {
  return gulp.src(CONFIG.vendor_files.assets)
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'));
});

gulp.task('assets.app', function () {
  return gulp.src(CONFIG.source_dir + '/assets/**/*')
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'))
    .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src(CONFIG.source_dir + '/less/main.less')
    .pipe(require('gulp-less')())
    .on('error', swallowError)
    .pipe(require('gulp-minify-css')({keepSpecialComments: 0}))
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'))
    .pipe(connect.reload());
});

gulp.task('tpl.components', function () {
  return gulp.src(CONFIG.source_dir + '/components/**/*.tpl.html')
    .pipe(html2js({
      base: CONFIG.source_dir + '/components',
      outputModuleName: 'templates-components',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(concat('templates-components.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/' + CONFIG.source_dir + '/'))
    .pipe(connect.reload());
});

gulp.task('tpl.app', function () {
  return gulp.src(CONFIG.source_dir + '/app/**/*.tpl.html')
    .pipe(html2js({
      base: CONFIG.source_dir + '/app',
      outputModuleName: 'templates-app',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(concat('templates-app.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/' + CONFIG.source_dir + '/'))
    .pipe(connect.reload());
});

gulp.task('js.app', function () {
  return gulp.src([
    CONFIG.source_dir + '/**/**/*.js',
    '!' + CONFIG.source_dir + '/**/**/*.spec.js',
    '!' + CONFIG.source_dir + '/assets/**/*.js'
  ])
    .pipe(require('gulp-ng-annotate')())
    .on('error', swallowError)
    .pipe(gulp.dest(CONFIG.build_dir + '/' + CONFIG.source_dir + '/'))
    .pipe(connect.reload());
});

gulp.task('js.vendor', function () {
  return gulp.src(CONFIG.vendor_files.js, {base: 'vendor'})
    .pipe(gulp.dest(CONFIG.build_dir + '/vendor'));
});

gulp.task('index', function () {
  return gulp.src(CONFIG.source_dir + '/index.html')
    .pipe(inject(gulp.src(CONFIG.build_dir + '/assets/main.css', {read: false}), {ignorePath: CONFIG.build_dir}))
    .pipe(inject(gulp.src([].concat(
      CONFIG.vendor_files.js,
      CONFIG.build_dir + '/' + CONFIG.source_dir + '/*',
      CONFIG.build_dir + '/'+ CONFIG.source_dir + '/app/**/*',
      CONFIG.build_dir + '/' + CONFIG.source_dir + '/components/**/*'
    ), {read: false}), {ignorePath: CONFIG.build_dir}))
    .pipe(gulp.dest(CONFIG.build_dir))
    .pipe(connect.reload());
});

gulp.task('build.assets', ['assets.vendor', 'assets.app', 'less', 'tpl.components', 'tpl.app', 'js.vendor', 'js.app']);

gulp.task('build.index', ['build.assets'], function () {
  gulp.start('index');
});

gulp.task('build.karmaconfig', ['build.assets'], function () {
  return gulp.src('karma-config.tpl.js')
    .pipe(require('gulp-template')({
      scripts: [].concat(
        CONFIG.vendor_files.js,
        CONFIG.test_files.js,
        CONFIG.build_dir + '/' + CONFIG.source_dir + '/templates-app.js',
        CONFIG.build_dir + '/' + CONFIG.source_dir + '/templates-components.js'
      )
    }))
    .pipe(rename('karma-config.js'))
    .pipe(gulp.dest(CONFIG.build_dir));
});

gulp.task('compile.assets', ['build.assets'], function () {
  return gulp.src(CONFIG.build_dir + '/assets/**/*')
    .pipe(gulp.dest(CONFIG.compile_dir + '/assets'));
});

gulp.task('compile.js', ['build.assets'], function () {
  return gulp.src([].concat(
    CONFIG.vendor_files.js,
    CONFIG.build_dir + '/' + CONFIG.source_dir + '/*',
    CONFIG.build_dir + '/' + CONFIG.source_dir + '/app/**/*',
    CONFIG.build_dir + '/' + CONFIG.source_dir + '/components/**/*'
  ))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(CONFIG.compile_dir + '/assets'));
});

gulp.task('compile.index', ['compile.assets', 'compile.js'], function () {
  return gulp.src(CONFIG.source_dir + '/index.html')
    .pipe(inject(gulp.src([
      CONFIG.compile_dir + '/assets/main.css',
      CONFIG.compile_dir + '/assets/app.js'
    ], {read: false}), {
      ignorePath: CONFIG.compile_dir,
      transform: (function () {
        var timestamp = new Date().getTime();
        return function (filepath, file, index, length, targetFile) {
          var tag = inject.transform.apply(inject.transform, arguments);
          if (filepath.slice(-3) === '.js') {
            tag = tag.split('.js').join('.js?' + timestamp);
          }
          return tag;
        };
      })()
    }))
    .pipe(require('gulp-htmlmin')({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest(CONFIG.compile_dir));
});

gulp.task('test', ['build.karmaconfig', 'build.index', 'compile.index'], function (done) {
  new karma.Server({
    configFile: __dirname + '/' + CONFIG.build_dir + '/karma-config.js',
    singleRun: true
  }, done).start();
});

gulp.task('build', ['clean'], function () {
  gulp.start('build.assets', 'build.index', 'build.karmaconfig');
});

gulp.task('compile', ['clean'], function () {
  gulp.start(
    'build.assets', 'build.index', 'build.karmaconfig',
    'compile.assets', 'compile.js', 'compile.index'
  );
});

gulp.task('default', ['clean'], function () {
  gulp.start(
    'build.assets', 'build.index', 'build.karmaconfig',
    'compile.assets', 'compile.js', 'compile.index',
    'test'
  );
});

gulp.task('watch', ['connect.build', 'build'], function () {
  gulp.watch(CONFIG.source_dir + '/assets/**/*', ['assets.app']);
  gulp.watch(CONFIG.source_dir + '/**/*.less', ['less']);
  gulp.watch(CONFIG.source_dir + '/index.html', ['index']);

  gulp.watch(CONFIG.source_dir + '/app/**/*.tpl.html', ['tpl.app']);
  gulp.watch(CONFIG.source_dir + '/components/**/*.tpl.html', ['tpl.components']);

  gulp.watch(CONFIG.source_dir + '/**/*.js', ['js.app']);
});
