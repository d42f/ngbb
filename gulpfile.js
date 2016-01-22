var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var html2js = require('gulp-html2js');
var connect = require('gulp-connect');

var CONFIG = require('./build.config.js');
CONFIG.build_dir = 'build2';
CONFIG.compile_dir = 'bin2';

gulp.task('connect.build', function () {
  return connect.server({
    port: 8080,
    root: CONFIG.build_dir,
    livereload: true
  });
});

gulp.task('connect.compile', function () {
  return connect.server({
    port: 8080,
    root: CONFIG.compile_dir,
    livereload: false
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
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'))
    .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src('src/less/main.less')
    .pipe(require('gulp-less')())
    .pipe(require('gulp-minify-css')())
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'))
    .pipe(connect.reload());
});

gulp.task('html2js.components', function () {
  return gulp.src('src/components/**/*.tpl.html')
    .pipe(html2js({
      base: 'src/components',
      outputModuleName: 'templates-components',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(require('gulp-concat')('templates-components.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'))
    .pipe(connect.reload());
});

gulp.task('html2js.app', function () {
  return gulp.src('src/app/**/*.tpl.html')
    .pipe(html2js({
      base: 'src/app',
      outputModuleName: 'templates-app',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(require('gulp-concat')('templates-app.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'))
    .pipe(connect.reload());
});

gulp.task('js.app', function () {
  return gulp.src(['src/**/**/*.js', '!src/**/**/*.spec.js', '!src/assets/**/*.js'])
    .pipe(require('gulp-ng-annotate')())
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'))
    .pipe(connect.reload());
});

gulp.task('js.vendor', function () {
  return gulp.src(CONFIG.vendor_files.js, {base: 'vendor'})
    .pipe(gulp.dest(CONFIG.build_dir + '/vendor'));
});

gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(inject(gulp.src(CONFIG.build_dir + '/assets/main.css', {read: false}), {ignorePath: CONFIG.build_dir}))
    .pipe(inject(gulp.src([].concat(
      CONFIG.vendor_files.js,
      CONFIG.build_dir + '/src/*',
      CONFIG.build_dir + '/src/app/**/*',
      CONFIG.build_dir + '/src/components/**/*'
    ), {read: false}), {ignorePath: CONFIG.build_dir}))
    .pipe(gulp.dest(CONFIG.build_dir))
    .pipe(connect.reload());
});

gulp.task('build.assets', ['assets.vendor', 'assets.app', 'less', 'html2js.components', 'html2js.app', 'js.vendor', 'js.app']);

gulp.task('build.index', ['build.assets'], function () {
  return gulp.start('index');
});

gulp.task('build', ['clean'], function () {
  return gulp.start('build.assets', 'build.index');
});

gulp.task('compile.assets', ['build.assets'], function () {
  return gulp.src([CONFIG.build_dir + '/assets/**/*'])
    .pipe(gulp.dest(CONFIG.compile_dir + '/assets'));
});

gulp.task('compile.js', ['build.assets'], function () {
  return gulp.src([].concat(
    CONFIG.vendor_files.js,
    CONFIG.build_dir + '/src/*',
    CONFIG.build_dir + '/src/app/**/*',
    CONFIG.build_dir + '/src/components/**/*'
  ))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(CONFIG.compile_dir + '/assets'));
});

gulp.task('compile.index', ['compile.assets', 'compile.js'], function () {
  return gulp.src('src/index.html')
    .pipe(inject(gulp.src(CONFIG.compile_dir + '/assets/main.css', {read: false}), {ignorePath: CONFIG.compile_dir}))
    .pipe(inject(gulp.src(CONFIG.compile_dir + '/assets/app.js', {read: false}), {ignorePath: CONFIG.compile_dir}))
    .pipe(require('gulp-htmlmin')({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest(CONFIG.compile_dir));
});

gulp.task('compile', ['build'], function () {
  return gulp.start('compile.assets', 'compile.js', 'compile.index');
});

gulp.task('watch', ['connect.build', 'build'], function () {
  gulp.watch(['src/assets/**/*'], ['assets.app']);
  gulp.watch(['src/**/*.less'], ['less']);
  gulp.watch(['src/index.html'], ['index']);

  gulp.watch(['src/app/**/*.tpl.html'], ['html2js.app']);
  gulp.watch(['src/components/**/*.tpl.html'], ['html2js.components']);

  gulp.watch(['src/**/*.js'], ['js.app']);
});

gulp.task('default', ['build']);
