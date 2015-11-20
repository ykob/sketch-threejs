var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var CONFIG = require('../package.json').projectConfig;

var reload = browserSync.reload;
var files = [
  {
    entries: ['./' + CONFIG.SRC + '/js/main.js'],
    source: 'main.js',
    dest: './js/'
  },
  {
    entries: ['./' + CONFIG.SRC + '/js/only_demo.js'],
    source: 'only_demo.js',
    dest: './js/'
  }
];

var createBundle = function(watch, options) {
  var b;
  var browserifyOpts = {
    entries: options.entries
  };

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

  var rebundle = function() {
    return b
            .bundle()
            .on('error', function(err) {
              console.log('bundle error: ' + err);
            })
            .pipe(source(options.source))
            .pipe(gulp.dest(options.dest));
  };

  b
    .on('update', rebundle)
    .on('log', function(message) {
      reload();
      return console.log(message);
    });

  rebundle();
};

var createBundles = function(bundles, watch) {
  bundles.forEach(function(bundle){
    createBundle(watch, bundle);
  });
};

gulp.task('browserify', function() {
  createBundles(files, false);
});

gulp.task('watchify', function() {
  createBundles(files, true);
});
