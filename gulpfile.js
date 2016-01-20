var gulp = require('gulp');
var inject = require('gulp-inject');

var CONFIG = require('./build.config.js');
CONFIG.build_dir = 'build2';
CONFIG.compile_dir = 'bin2';

gulp.task('clean', function () {
  return gulp.src([CONFIG.compile_dir, CONFIG.build_dir], {read: false})
    .pipe(require('gulp-clean')());
});

gulp.task('assets.vendor', ['clean'], function () {
  return gulp.src(CONFIG.vendor_files.assets)
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'));
});

gulp.task('assets.app', ['clean'], function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'));
});

gulp.task('less', ['clean'], function () {
  return gulp.src('src/less/main.less')
    .pipe(require('gulp-less')())
    .pipe(require('gulp-minify-css')())
    .pipe(gulp.dest(CONFIG.build_dir + '/assets/'));
});

gulp.task('html2js.components', ['clean'], function () {
  return gulp.src('src/components/**/*.tpl.html')
    .pipe(require('gulp-html2js')({
      base: '.',
      outputModuleName: 'templates-components',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(require('gulp-concat')('templates-components.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'));
});

gulp.task('html2js.app', ['clean'], function () {
  return gulp.src('src/app/**/*.tpl.html')
    .pipe(require('gulp-html2js')({
      base: '.',
      outputModuleName: 'templates-app',
      useStrict: true,
      target: 'ng'
    }))
    .pipe(require('gulp-concat')('templates-app.js'))
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'));
});

gulp.task('js.app', ['clean'], function () {
  return gulp.src(['src/**/**/*.js', '!src/**/**/*.spec.js', '!src/assets/**/*.js'])
    .pipe(require('gulp-ng-annotate')())
    .pipe(gulp.dest(CONFIG.build_dir + '/src/'));
});

gulp.task('js.vendor', ['clean'], function () {
  return gulp.src(CONFIG.vendor_files.js, {base: 'vendor'})
    .pipe(gulp.dest(CONFIG.build_dir + '/vendor'));
});

gulp.task('index', ['clean', 'less', 'js.vendor', 'js.app'], function () {
  return gulp.src('src/index.html')
    .pipe(inject(gulp.src([CONFIG.build_dir + '/assets/main.css'], {read: false}), {ignorePath: CONFIG.build_dir}))
    .pipe(inject(gulp.src(CONFIG.vendor_files.js, {read: false})))
    .pipe(gulp.dest(CONFIG.build_dir));
});

gulp.task('build', [
  'clean',
  'assets.vendor', 'assets.app', 'less', 'html2js.components', 'html2js.app', 'js.vendor', 'js.app', 'index',
]);

gulp.task('default', ['build']);
