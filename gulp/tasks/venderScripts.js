const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').vendorScripts;

gulp.task('vendorScripts', () => {
  return gulp.src(conf.src)
    .pipe($.concat(conf.concat))
    .pipe(gulp.dest(conf.dest));
});
