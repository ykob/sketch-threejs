var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var CONFIG = require('../package.json').projectConfig;

gulp.task('browserify', function() {
  return browserify({
    entries: ['./' + CONFIG.SRC + '/js/main.js']
  }).bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(CONFIG.DST + CONFIG.PATH + '/js'));
});
