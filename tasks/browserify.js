var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var CONFIG = require('../package.json').projectConfig;

var browserifyOpts = {
  entries: ['./' + CONFIG.SRC + '/js/main.js']
};
var reload = browserSync.reload;

var bundler = function(watch) {
  var b;

  if (watch) {
    browserifyOpts.debug = true;
    browserifyOpts.cache = {};
    browserifyOpts.packageCache = {};
    browserifyOpts.fullPath = true;
    browserifyOpts.transform = ['glslify'];
    b = watchify(browserify(browserifyOpts));
  } else {
    b = browserify(browserifyOpts);
  }

  var bundle = function() {
    return b
            .bundle()
            .on('error', function(err) {
              console.log('bundle error: ' + err);
            })
            .pipe(source('main.js'))
            .pipe(gulp.dest('./js/'));
  };

  b
    .on('update', bundle)
    .on('log', function(message) {
      reload();
      return console.log(message);
    });

  return bundle();
};

gulp.task('browserify', function() {
  return bundler();
});

gulp.task('watchify', function() {
  return bundler(true);
});
